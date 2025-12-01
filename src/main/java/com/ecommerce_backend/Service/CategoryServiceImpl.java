package com.ecommerce_backend.Service;


import com.ecommerce_backend.Entity.*;
import com.ecommerce_backend.ExceptionHandler.*;
import com.ecommerce_backend.Repository.*;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.*;

@Service
public class CategoryServiceImpl implements CategoryService {

    @Autowired
    CategoryRepository categoryRepository;


    @Override
    public Category createCategory(Category category) {
        String categoryId = category.getCategoryId();
        String name = category.getName();
        if (categoryRepository.existsById(categoryId)) {
            throw new ResourceAlreadyExistsException("Category", "categoryId", categoryId);
        } else if (categoryRepository.existsByName(name)) {
            throw new ResourceAlreadyExistsException("Category", "name", name);
        }

        categoryRepository.save(category);
        return categoryRepository.findById(category.getCategoryId())
                .orElseThrow(() -> new IllegalStateException("Creation failed for: " + categoryId));
    }

    @Override
    public Category getCategoryById(String categoryId) {
        return categoryRepository.findById(categoryId)
                .orElseThrow(() -> new ResourceNotFoundException("Category", "categoryId", categoryId));
    }

    @Override
    public List<Category> getAllCategories() {
        return categoryRepository.findAll();
    }

    @Override
    public Category updateCategory(Category newCategory) {
        getCategoryById(newCategory.getCategoryId());
        return categoryRepository.save(newCategory);
    }

    @Override
    public String deleteCategory(String categoryId) {
        Category existingCategory = getCategoryById(categoryId);
        categoryRepository.delete(existingCategory);

        if (categoryRepository.existsById(categoryId)) {
            throw new IllegalStateException("Deletion failed for: " + categoryId);
        }
        return "Category deleted successfully";
    }
}
