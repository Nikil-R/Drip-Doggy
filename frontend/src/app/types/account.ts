export interface Order {
  id: string;
  date: string;
  total: number;
  status: "Delivered" | "Shipped" | "Processing";
  items: {
    name: string;
    brand: string;
    size: string;
    color: string;
    price: number;
    quantity: number;
    image: string;
  }[];
}

export interface AddressItem {
  id: number;
  type: string;
  firstName: string;
  lastName: string;
  buildingNo: string;
  buildingName: string;
  street: string;
  area: string;
  city: string;
  state: string;
  postalCode: string;
  phone: string;
  isDefault: boolean;
}

export interface WishlistItem {
  id: number;
  brand: string;
  name: string;
  price: number;
  image: string;
  outOfStock?: boolean;
}
