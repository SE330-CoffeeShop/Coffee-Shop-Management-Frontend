import axios from "@/lib/axiosInstance";

class ProductServices {
  async getAllProductVariantsByProductId(productId: string) {
    try {
      const response = await axios.get(`/product-variant/by-product/${productId}`);
      return response.data;
    } catch (error) {
      console.error("Error fetching product variants:", error);
      throw error;
    }
  }
}

export default new ProductServices();