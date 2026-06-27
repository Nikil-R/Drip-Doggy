package com.dripdoggy.backend.ResponseDto;

import java.util.List;

public class CategoryDeleteResponseDto extends ResponseMsgDto {
    private String categoryName;
    private List<SubCategoryInfo> subCategories;

    public CategoryDeleteResponseDto() {
        super();
    }

    public CategoryDeleteResponseDto(Integer status, String message, String categoryName, List<SubCategoryInfo> subCategories) {
        super(status, message);
        this.categoryName = categoryName;
        this.subCategories = subCategories;
    }

    public String getCategoryName() {
        return categoryName;
    }

    public void setCategoryName(String categoryName) {
        this.categoryName = categoryName;
    }

    public List<SubCategoryInfo> getSubCategories() {
        return subCategories;
    }

    public void setSubCategories(List<SubCategoryInfo> subCategories) {
        this.subCategories = subCategories;
    }

    public static class SubCategoryInfo {
        private Long subCategoryId;
        private String subcategoryName;

        public SubCategoryInfo() {
        }

        public SubCategoryInfo(Long subCategoryId, String subcategoryName) {
            this.subCategoryId = subCategoryId;
            this.subcategoryName = subcategoryName;
        }

        public Long getSubCategoryId() {
            return subCategoryId;
        }

        public void setSubCategoryId(Long subCategoryId) {
            this.subCategoryId = subCategoryId;
        }

        public String getSubcategoryName() {
            return subcategoryName;
        }

        public void setSubcategoryName(String subcategoryName) {
            this.subcategoryName = subcategoryName;
        }
    }
}
