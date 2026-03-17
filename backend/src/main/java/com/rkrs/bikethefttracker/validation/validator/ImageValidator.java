package com.rkrs.bikethefttracker.validation.validator;

import com.rkrs.bikethefttracker.validation.annotation.Image;
import jakarta.validation.ConstraintValidator;
import jakarta.validation.ConstraintValidatorContext;
import org.springframework.web.multipart.MultipartFile;

import java.util.Arrays;

public class ImageValidator implements ConstraintValidator<Image, MultipartFile> {

    private String[] allowedTypes;
    private long maxSize;

    @Override
    public void initialize(Image constraintAnnotation) {
        this.allowedTypes = constraintAnnotation.allowedTypes();
        this.maxSize = constraintAnnotation.maxSize();
    }

    @Override
    public boolean isValid(MultipartFile file, ConstraintValidatorContext context) {

        if (file == null || file.isEmpty() || file.getSize() == 0) {
            return false;
        }

        boolean validType = Arrays.asList(allowedTypes)
                .contains(file.getContentType());

        boolean validSize = file.getSize() <= maxSize;

        return validType && validSize;
    }
}
