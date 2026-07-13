import axios from "axios";
import { API_CONFIG } from "../utils/api-config";
import { productApi } from "./product-api";
import type { Product } from "../data/products";

const BASE_URL = `${API_CONFIG.BASE_URL}/dripdoggy/api/public/curated-collections`;

export interface PublicCuratedCollection {
  sectionKey: string;
  title: string;
  subtitle?: string;
  isActive: boolean;
  products: Product[];
}

export const curatedCollectionApi = {
  getCollection: async (sectionKey: string): Promise<PublicCuratedCollection> => {
    const res = await axios.get(`${BASE_URL}/${sectionKey}`);
    const data = res.data;
    
    const mappedProducts = (data.products || []).map((p: any) =>
      productApi.mapBackendProduct(p)
    );

    return {
      sectionKey: data.sectionKey,
      title: data.title,
      subtitle: data.subtitle,
      isActive: !!data.isActive,
      products: mappedProducts
    };
  }
};
