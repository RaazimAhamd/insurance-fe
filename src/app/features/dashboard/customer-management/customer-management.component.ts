


import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ApiService } from '../../../api/api.service';
import { CommonService } from '../../../shared/shared/common.service';

@Component({
  selector: 'app-customer-management',
  templateUrl: './customer-management.component.html',
  styleUrls: ['./customer-management.component.scss'],
  standalone: true,
  imports: [CommonModule, FormsModule, ReactiveFormsModule],
})
export class CustomerManagementComponent {
  customers: any[] = [];
  filteredCustomers: any[] = [];

  showModal = false;
  modalMode: 'add' | 'edit' | 'view' = 'add';
  currentCustomerIndex: number | null | any = null;

  searchText = '';
  sortBy = '';
  vehicleFilter = '';

  customerForm: FormGroup;
  vehicleTypes = ['2 Wheeler', 'Private Car', 'GCV', 'PCV', '3 Wheeler'];

  selectedFiles: File[] = [];
  filePreviews: { file: File | any; url: string; name?: string, type: string }[] = [];

  loading = false;
  errorMsg = '';

  currId: number = -1;

  constructor(private fb: FormBuilder, private api: ApiService, public common: CommonService) {
    this.customerForm = this.fb.group({
      customerName: ['', Validators.required],
      vehicleNo: ['', Validators.required],
      contactNo: ['', [Validators.required, Validators.pattern(/^\d+$/)]],
      altContactNo: ['', [Validators.required, Validators.pattern(/^\d+$/)]],
      policyNo: [''],
      policyExpireDate: [''],
      currentDateTime: [{ value: '', disabled: true }],
      vehicleType: ['', Validators.required],
      documents: [[]]
    });

    // Load all customers on init
    this.getAllCustomers();
  }




  openModal(mode: 'add' | 'edit' | 'view', index?: number) {

    this.modalMode = mode;
    this.showModal = true;
    this.errorMsg = '';

    // Always reset file arrays when opening modal
    this.selectedFiles = [];
    this.filePreviews = [];

    if (mode === 'add') {
      this.customerForm.reset();
      this.customerForm.patchValue({
        currentDateTime: new Date().toLocaleString(),
      });
      this.currentCustomerIndex = null;
    }

    if ((mode === 'edit' || mode === 'view') && index !== undefined) {
      this.currentCustomerIndex = index;
      const customer = this.filteredCustomers[index];
      this.customerForm.patchValue(customer);

      // Add existing backend documents to filePreviews
      if (customer.documents && Array.isArray(customer.documents)) {
        customer.documents.forEach((doc: any) => {
          this.filePreviews.push({
            file: null,          // no File object, it's from server
            url: doc.url,
            name: doc?.name,
            type: doc.type
          });
        });
      }
    }
  }


  closeModal() {
    this.showModal = false;
    this.errorMsg = '';
    this.selectedFiles = [];
    this.filePreviews = [];
  }


  /** --------- CRUD OPERATIONS --------- */
  getAllCustomers() {
    this.loading = true;
    this.api.getAllCustomer().subscribe({
      next: (res: any) => {
        this.customers = res || [];
        this.applyFilters();
        this.loading = false;
      },
      error: (err) => {
        console.error('Error fetching customers', err);
        this.errorMsg = 'Failed to load customers';
        this.loading = false;
      }
    });
  }

  saveCustomer() {
    if (this.customerForm.invalid) return;

    this.loading = true;
    this.errorMsg = '';

    const rawData = this.customerForm.getRawValue();
    const formData = new FormData();

    // 1. Append basic text fields
    Object.keys(rawData).forEach(key => {
      if (key !== 'documents') {
        formData.append(key, rawData[key] ?? '');
      }
    });

    // 2. NEW LOGIC: Filter out existing files vs new files
    // We send the files that were ALREADY in the database and NOT deleted by the user
    const existingDocs = this.filePreviews
      .filter(p => !p.file) // Only those that DON'T have a local File object
      .map(p => ({
        name: p.name,
        type: p.type,
        url: p.url
      }));

    formData.append('existingDocuments', JSON.stringify(existingDocs));

    // 3. Append newly selected files
    this.selectedFiles.forEach(file => {
      formData.append('documents', file);
    });

    // ================= ADD =================
    if (this.modalMode === 'add') {
      this.api.addCustomer(formData).subscribe({
        next: (res: any) => {
          this.closeModal();
          this.getAllCustomers();
        },
        error: (err) => {
          this.errorMsg = err?.error?.message || 'Failed to add customer';
          this.loading = false;
        }
      });
    }

    // ================= EDIT =================
    else if (this.modalMode === 'edit' && this.currentCustomerIndex !== null) {
      const id = this.filteredCustomers[this.currentCustomerIndex]._id;

      this.api.updateIdCustomer(id, formData).subscribe({
        next: (res: any) => {
          this.closeModal();
          this.getAllCustomers();
        },
        error: (err) => {
          this.errorMsg = err?.error?.message || 'Failed to update customer';
          this.loading = false;
        }
      });
    }
  }

  savedCustomer() {
    if (this.customerForm.invalid) return;

    this.loading = true;
    this.errorMsg = '';

    const rawData = this.customerForm.getRawValue();

    if (this.modalMode === 'add') {
      rawData.currentDateTime = new Date().toLocaleString();
    }

    const formData = new FormData();

    // Append normal fields
    Object.keys(rawData).forEach(key => {
      if (key !== 'documents') {
        formData.append(key, rawData[key] ?? '');
      }
    });

    // Append files
    this.selectedFiles.forEach(file => {
      formData.append('documents', file);
    });

    // ================= ADD =================
    if (this.modalMode === 'add') {

      this.api.addCustomer(formData).subscribe({
        next: (res: any) => {

          this.customers.push({
            ...rawData,
            id: res?.id || Date.now(),
            documents: res?.documents || []
          });

          this.applyFilters();
          this.closeModal();
          this.selectedFiles = [];
          this.filePreviews = [];
          this.loading = false;
        },
        error: (err) => {
          console.error('Add customer error', err);
          this.errorMsg = err?.error?.message || 'Failed to add customer';
          this.loading = false;
        },
        complete: () => { this.getAllCustomers() }
      });

    }

    // ================= EDIT =================
    else if (this.modalMode === 'edit' && this.currentCustomerIndex !== null) {

      const id = this.filteredCustomers[this.currentCustomerIndex]._id;

      this.api.updateIdCustomer(id, formData).subscribe({
        next: (res: any) => {

          this.filteredCustomers[this.currentCustomerIndex] = {
            ...rawData,
            id: id,
            documents: res?.documents || []
          };

          this.applyFilters();
          this.closeModal();
          this.selectedFiles = [];
          this.filePreviews = [];
          this.loading = false;
        },
        error: (err) => {
          console.error('Update customer error', err);
          this.errorMsg = err?.error?.message || 'Failed to update customer';
          this.loading = false;
        },
        complete: () => { this.getAllCustomers() }
      });

    }

  }


  deleteCustomer(id: number) {
    const customer = this.filteredCustomers.find(x => x._id === id)._id;

    if (!customer) return;

    if (confirm(`Delete customer ?`)) {
      this.loading = true;
      this.api.deleteIdCustomer(customer).subscribe({
        next: () => {
          this.getAllCustomers();
          this.loading = false;
        },
        error: (err) => {
          console.error('Delete customer error', err);
          this.errorMsg = err?.error?.message || 'Failed to delete customer';
          this.loading = false;
        }
      });
    }
  }

  /** --------- FILTER & SORT --------- */
  applyFilters() {
    let temp = [...this.customers];

    // Search filter
    if (this.searchText) {
      const text = this.searchText.toLowerCase();
      temp = temp.filter(
        c =>
          c.customerName.toLowerCase().includes(text) ||
          c.contactNo.toString().includes(text) ||
          c.altContactNo.toString().includes(text) ||
          c.vehicleNo.toLowerCase().includes(text)
      );
    }

    // Vehicle filter
    if (this.vehicleFilter) {
      temp = temp.filter(c => c.vehicleType === this.vehicleFilter);
    }

    // Sorting
    switch (this.sortBy) {
      case 'addedAsc':
        temp.sort((a, b) => new Date(a.currentDateTime).getTime() - new Date(b.currentDateTime).getTime());
        break;
      case 'addedDesc':
        temp.sort((a, b) => new Date(b.currentDateTime).getTime() - new Date(a.currentDateTime).getTime());
        break;
      case 'policyAsc':
        temp.sort((a, b) => new Date(a.policyExpireDate).getTime() - new Date(b.policyExpireDate).getTime());
        break;
      case 'policyDesc':
        temp.sort((a, b) => new Date(b.policyExpireDate).getTime() - new Date(a.policyExpireDate).getTime());
        break;
      case 'nameAsc':
        temp.sort((a, b) => a.customerName.localeCompare(b.customerName));
        break;
      case 'nameDesc':
        temp.sort((a, b) => b.customerName.localeCompare(a.customerName));
        break;
    }

    this.filteredCustomers = temp;

  }


  onFileSelected(event: any) {
    const files: FileList = event.target.files;

    if (!files) return;

    for (let i = 0; i < files.length; i++) {
      const file = files[i];

      // Validate type
      if (!['application/pdf', 'image/jpeg', 'image/png'].includes(file.type)) {
        alert('Only PDF, JPG, PNG allowed');
        continue;
      }

      // 🔥 Prevent duplicate files (by name + size)
      const alreadyExists = this.selectedFiles.some(
        f => f.name === file.name && f.size === file.size
      );

      if (alreadyExists) {
        alert('File already added');
        continue;
      }

      const reader = new FileReader();

      reader.onload = (e: any) => {
        this.filePreviews.push({
          file: file,
          url: e.target.result,
          type: file.type === 'application/pdf' ? 'pdf' : 'image'
        });
      };

      reader.readAsDataURL(file);
      this.selectedFiles.push(file);
    }

    this.customerForm.patchValue({
      documents: this.selectedFiles
    });

    event.target.value = ''; // reset input
  }


  // removeFile(index: number) {
  //   console.log('index', this.selectedFiles, this.filePreviews, index)
  //   this.selectedFiles.splice(index, 1);
  //   this.filePreviews.splice(index, 1);

  //   this.customerForm.patchValue({
  //     documents: this.filePreviews
  //   });

  //   console.log('vale', this.customerForm.value)
  // }
  removeFile(index: number) {
    const removedItem = this.filePreviews[index];

    // If it's a newly selected file (has a 'file' object), remove it from selectedFiles array
    if (removedItem.file) {
      const fileIndex = this.selectedFiles.indexOf(removedItem.file);
      if (fileIndex > -1) {
        this.selectedFiles.splice(fileIndex, 1);
      }
    }

    // Remove from the preview UI
    this.filePreviews.splice(index, 1);
  }

  viewFile(file: { file: File | null; url: string; type: string; name?: string }) {
    if (file.file) {
      const blob = new Blob([file.file], { type: file.file.type });
      const url = URL.createObjectURL(blob);
      window.open(url, '_blank');
    } else if (file.url) {
      window.open(file.url, '_blank');
    }
  }


  downloadFile(file: { file: File | null; url: string; type: string; name?: string }) {
    if (file.file) {
      const blob = new Blob([file.file], { type: file.file.type });
      const url = URL.createObjectURL(blob);

      const a = document.createElement('a');
      a.href = url;
      a.download = file.file.name;
      a.click();
      URL.revokeObjectURL(url);

    } else if (file.url) {
      fetch(file.url)
        .then(res => res.blob())
        .then(blob => {
          const url = URL.createObjectURL(blob);
          const a = document.createElement('a');
          a.href = url;
          a.download = file.name || 'document';
          a.click();
          URL.revokeObjectURL(url);
        });
    }
  }

  downloadAll(id: number) {
    if (this.filteredCustomers.find(x => x._id === id)?.documents?.length === 0) {
      return;
    }
    this.api.downloadAll(id).subscribe({
      next: (response: any) => {

        const blob = response.body;

        const contentDisposition = response.headers.get('content-disposition');
        let fileName = '';

        if (contentDisposition) {
          const match = contentDisposition.match(/filename="?([^"]+)"?/);
          if (match && match[1]) {
            fileName = match[1];
          }
        }

        const url = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = fileName;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        window.URL.revokeObjectURL(url);
      }
    });

  }

  export() {
    const email = prompt("Enter email address to receive export:");
    if (!email) return;
    if (email === 'annie@gmail.com') {
      const downloadUrl = `${this.api.baseUrl}/customers/export/all-data`;
      window.open(downloadUrl, '_blank');
    } else {
      this.common.logout();
    }
  }
}
