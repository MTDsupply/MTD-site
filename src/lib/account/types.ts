/** Account row types and constants shared by server and client code. */

export type OrderItem = { sku: string; name: string; unit: string; qty: number; price: number };
export type OrderRow = {
  id: string;
  number: number | null;
  created_at: string;
  amount_total: number;
  currency: string;
  status: string;
  mode: string;
  stripe_session_id: string;
  items: OrderItem[];
  shipping: {
    name?: string | null;
    address?: { line1?: string | null; line2?: string | null; city?: string | null; state?: string | null; postal_code?: string | null; country?: string | null } | null;
  } | null;
  shipped_at: string | null;
  carrier: string | null;
  tracking_number: string | null;
  tracking_url: string | null;
};
export type AddressRow = {
  id: string;
  label: string;
  name: string;
  line1: string;
  line2: string | null;
  city: string;
  province: string;
  postal_code: string;
  country: string;
  notes: string | null;
  is_default: boolean;
};
export type ProfileRow = {
  user_id: string;
  company: string;
  contact_name: string;
  phone: string | null;
  business_type: string | null;
  delivery_notes: string | null;
};
export type UsualRow = { sku: string; unit: string; qty: number };

export const BUSINESS_TYPES = ["Café", "Restaurant", "Hotel", "Caterer", "Events", "Retail", "Other"] as const;
