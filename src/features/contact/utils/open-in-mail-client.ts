// Hands the prepared mailto: link to the visitor's mail client.
export function openInMailClient(url: string): void {
  window.open(url, '_self');
}
