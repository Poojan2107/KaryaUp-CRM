import { jsPDF } from 'jspdf';
import 'jspdf-autotable';

function formatDate(d) {
  return d ? new Date(d).toLocaleDateString() : '-';
}

export function exportContactsPDF(contacts) {
  const doc = new jsPDF();
  doc.setFontSize(18).text('Contacts Report', 14, 22);
  doc.setFontSize(10).text(`Generated: ${new Date().toLocaleString()}`, 14, 30);

  doc.autoTable({
    startY: 36,
    head: [['Name', 'Email', 'Phone', 'Company', 'Role', 'Created']],
    body: contacts.map((c) => [c.name, c.email || '-', c.phone || '-', c.company || '-', c.role || '-', formatDate(c.createdAt)]),
    styles: { fontSize: 9 },
    headStyles: { fillColor: [25, 118, 210] },
  });

  doc.save('contacts-report.pdf');
}

export function exportDealsPDF(deals) {
  const doc = new jsPDF('landscape');
  doc.setFontSize(18).text('Deals Pipeline Report', 14, 22);
  doc.setFontSize(10).text(`Generated: ${new Date().toLocaleString()}`, 14, 30);

  doc.autoTable({
    startY: 36,
    head: [['Title', 'Value', 'Stage', 'Company', 'Created']],
    body: deals.map((d) => [d.title, `$${d.value?.toLocaleString() || 0}`, d.stage, d.company || '-', formatDate(d.createdAt)]),
    styles: { fontSize: 9 },
    headStyles: { fillColor: [46, 125, 50] },
  });

  doc.save('deals-report.pdf');
}

export function exportActivitiesPDF(activities) {
  const doc = new jsPDF();
  doc.setFontSize(18).text('Activities Report', 14, 22);
  doc.setFontSize(10).text(`Generated: ${new Date().toLocaleString()}`, 14, 30);

  doc.autoTable({
    startY: 36,
    head: [['Type', 'Subject', 'Contact', 'Deal', 'Date']],
    body: activities.map((a) => [a.type, a.subject, a.contactId?.name || '-', a.dealId?.title || '-', formatDate(a.createdAt)]),
    styles: { fontSize: 9 },
    headStyles: { fillColor: [237, 108, 2] },
  });

  doc.save('activities-report.pdf');
}

export function exportContactsCSV(contacts) {
  const header = 'Name,Email,Phone,Company,Role,Notes,Created\n';
  const rows = contacts
    .map((c) => `"${c.name}","${c.email || ''}","${c.phone || ''}","${c.company || ''}","${c.role || ''}","${(c.notes || '').replace(/"/g, '""')}","${formatDate(c.createdAt)}"`)
    .join('\n');

  const blob = new Blob([header + rows], { type: 'text/csv' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = 'contacts.csv';
  a.click();
  URL.revokeObjectURL(url);
}
