interface User {
  id: string;
  uuid: string;
  role: string;
  name: string;
  email: string;
  profilePicture: string | null;
}
export type ProductElement = {
  id: string;
  productId: string;
  type: "text" | "image";
  content: string | null;
  imageUrl: string | null;
  caption: string | null;
  order: number;
  createdAt: string; // ISO date
  updatedAt: string; // ISO date
};

export type ProductWithElements = {
  id: string;
  keyword: string;
  name: string;
  createdBy: string;
  createdAt: string; // ISO date
  updatedAt: string; // ISO date
  elements: ProductElement[];
};

export default User;
