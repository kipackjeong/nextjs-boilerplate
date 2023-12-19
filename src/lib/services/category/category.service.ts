import IService from "@core/interfaces/service.interface";
import axiosInstance from "@core/utils/axios";
import categoryApi from "@lib/apis/category.api";
import { ICategory } from "@lib/models/category";

class CategoryService implements IService {
  public async findById(id: string) {
    return await categoryApi.get({ id });
  }

  public async findAll() {
    const categories = await categoryApi.get();
    return categories;
  }
  public async create(payload: ICategory) {
    return await categoryApi.post(payload);
  }
  public async updateById(id: string, payload: ICategory) {
    return await categoryApi.put(id, payload);
  }
  public async deleteById(id: string) {
    return await categoryApi.delete(id);
  }
  public async deleteMultipleByIds(ids: string[]) {
    for (var id in ids) {
      await categoryApi.delete(id);
    }
  }
}

export default new CategoryService();
