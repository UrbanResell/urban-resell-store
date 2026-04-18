# Security Specification - ResellNow

## Data Invariants
1. A Product can only be created/updated/deleted by an Admin.
2. An Order can be created by anyone (public).
3. An Order can only be read/updated/deleted by an Admin.
4. Admins are defined in the `/admins/` collection.
5. All IDs must be valid alphanumeric strings.
6. All timestamps must be server-generated.

## The "Dirty Dozen" Payloads (Deny cases)
1. Create product as non-admin -> Denied.
2. Create order with fake status (e.g. "Shipped") -> Denied.
3. Update product imageUrl to a 2MB string -> Denied.
4. Update order `customerName` to someone else's name by a non-admin -> Denied.
5. List all orders as non-admin -> Denied.
6. Delete a product as non-admin -> Denied.
7. Create an order with a missing phone number -> Denied.
8. Create an order with a future `createdAt` timestamp (not `request.time`) -> Denied.
9. Admin escalation: User trying to add themselves to `/admins/` -> Denied.
10. Update order status to "Contacted" without being an admin -> Denied.
11. Injecting script into `productDescription` -> Denied (via size and type limits).
12. Deleting `/admins/` entries as non-admin -> Denied.
