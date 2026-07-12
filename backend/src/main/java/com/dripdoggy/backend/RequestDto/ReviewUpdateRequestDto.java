package com.dripdoggy.backend.RequestDto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;
import org.springframework.web.multipart.MultipartFile;
import java.util.List;

public class ReviewUpdateRequestDto {

    @NotBlank(message = "Comment is required.")
    @Size(max = 250, message = "Comment cannot exceed 250 characters.")
    private String comment;

    private List<MultipartFile> images;

    public ReviewUpdateRequestDto() {
    }

    public ReviewUpdateRequestDto(String comment) {
        this.comment = comment;
    }

    public ReviewUpdateRequestDto(String comment, List<MultipartFile> images) {
        this.comment = comment;
        this.images = images;
    }

    public String getComment() {
        return comment;
    }

    public void setComment(String comment) {
        this.comment = comment;
    }

    public List<MultipartFile> getImages() {
        return images;
    }

    public void setImages(List<MultipartFile> images) {
        this.images = images;
    }
}
