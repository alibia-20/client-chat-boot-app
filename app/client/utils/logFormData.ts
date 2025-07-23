export function logFormData(formData: FormData) {
  console.log("📦 FormData contenu :");
  for (const [key, value] of formData.entries()) {
    if (value instanceof File) {
      console.log(
        `🖼️ ${key}: File { name: "${value.name}", size: ${value.size} bytes, type: "${value.type}" }`
      );
    } else {
      console.log(`📄 ${key}: ${value}`);
    }
  }
}
