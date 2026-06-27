import Swal from 'sweetalert2';

export function showSuccess(message, title = 'Success') {
  return Swal.fire(title, message, 'success');
}

export function showError(message, title = 'Error') {
  return Swal.fire(title, message, 'error');
}

export function showWarning(message, title = 'Validation') {
  return Swal.fire(title, message, 'warning');
}

export function confirmDialog(options) {
  return Swal.fire({ icon: 'warning', showCancelButton: true, ...options });
}
