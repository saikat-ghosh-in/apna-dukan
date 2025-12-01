package com.ecommerce_backend.Service;

import com.ecommerce_backend.Entity.Category;

import java.util.List;

public interface CategoryService {

    Category createCategory(Category category);
    Category getCategoryById(String categoryId);
    List<Category> getAllCategories();

    Category updateCategory(Category newCategory);
    String deleteCategory(String categoryId);
}
