const Swal = (window as any).Swal;

export const showAlert = {
  success: (title: string, text?: string) => {
    Swal.fire({
      icon: 'success',
      title,
      text,
      background: '#18181b',
      color: '#f4f4f5',
      confirmButtonColor: '#2563eb',
      customClass: {
        popup: 'rounded-2xl border border-zinc-800 shadow-2xl',
      }
    });
  },
  error: (title: string, text?: string) => {
    Swal.fire({
      icon: 'error',
      title,
      text,
      background: '#18181b',
      color: '#f4f4f5',
      confirmButtonColor: '#ef4444',
      customClass: {
        popup: 'rounded-2xl border border-zinc-800 shadow-2xl',
      }
    });
  },
  confirm: async (title: string, text?: string) => {
    const result = await Swal.fire({
      title,
      text,
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#ef4444',
      cancelButtonColor: '#3f3f46',
      confirmButtonText: 'Yes, delete it!',
      background: '#18181b',
      color: '#f4f4f5',
      customClass: {
        popup: 'rounded-2xl border border-zinc-800 shadow-2xl',
      }
    });
    return result.isConfirmed;
  }
};
