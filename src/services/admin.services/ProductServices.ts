import axiosInstance from "@/lib/axiosInstance";
import { CreateProductDto, UpdateProductDto } from "@/types/product.type";

class ProductAdminServices {
  async createProduct(productData: CreateProductDto) {
    try {
      const formData = new FormData();

      // Tạo object JSON cho phần 'product'
      const productJson = {
        productName: productData.productName,
        productDescription: productData.productDescription,
        productPrice: productData.productPrice,
        productCategory: productData.productCategory,
        productIngredients: productData.productIngredients,
        drink: productData.drink,
      };

      // Thêm phần 'product' vào FormData dưới dạng JSON với Content-Type application/json
      formData.append(
        "product",
        new Blob([JSON.stringify(productJson)], { type: "application/json" }),
        "product.json"
      );

      // Thêm phần 'image' nếu có, đảm bảo Content-Type phù hợp
      if (productData.image) {
        const imageType = productData.image.type || "image/jpeg"; // Fallback nếu type không xác định
        formData.append(
          "image",
          productData.image,
          `image.${imageType.split("/")[1]}`
        );
      }

      const response = await axiosInstance.post(
        "product/new-with-image",
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );
      return response.data;
    } catch (error) {
      console.error("Error creating product:", error);
      throw new Error("Failed to create product");
    }
  }

  async updateProduct(updateProduct: UpdateProductDto) {
    try {
      console.log("Updating product with data:", updateProduct);
      const response = await axiosInstance.patch(
        `/product/`,
        updateProduct
      );
      return response.data;
    } catch (error) {
      console.error("Error updating product:", error);
      throw new Error("Failed to update product");
    }
  }

  async updateImageProduct(productId: string, file: File) {
    try {
      const formData = new FormData();
      formData.append("file", file);

      const response = await axiosInstance.post(
        `product/image/${productId}`,
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );
      return response.data;
    } catch (error) {
      console.error("Error updating product image:", error);
      throw new Error("Failed to update product image");
    }
  }

  async deleteProduct(productId: string) {
    try {
      const response = await axiosInstance.delete(`product/${productId}`);
      return response.data;
    } catch (error) {
      console.error("Error deleting product:", error);
      throw new Error("Failed to delete product");
    }
  }

  async deleteImageProduct(productId: string) {
    try {
      const response = await axiosInstance.delete(`product/image/${productId}`);
      return response.data;
    } catch (error) {
      console.error("Error deleting product image:", error);
      throw new Error("Failed to delete product image");
    }
  }
}

export default new ProductAdminServices();
