import type { Invoice } from "../utils/mockTodos";

export function InvoiceFields({
  invoice,
  disabled,
}: {
  invoice: Invoice;
  disabled?: boolean;
}) {
  return (
    <div className="space-y-2">
      <h2 className="font-bold text-lg">
        <input
          name="title"
          defaultValue={invoice.title}
          placeholder="Invoice Title"
          className="w-full rounded border border-opacity-50 p-2"
          disabled={disabled}
        />
      </h2>
      <div>
        <textarea
          name="body"
          defaultValue={invoice.body}
          rows={6}
          placeholder="Invoice Body..."
          className="w-full rounded border border-opacity-50 p-2"
          disabled={disabled}
        />
      </div>
    </div>
  );
}
