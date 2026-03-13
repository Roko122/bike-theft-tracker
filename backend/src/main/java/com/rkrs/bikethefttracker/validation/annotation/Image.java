package com.rkrs.bikethefttracker.validation.annotation;

import com.rkrs.bikethefttracker.validation.validator.ImageValidator;
import jakarta.validation.Constraint;
import jakarta.validation.Payload;

import java.lang.annotation.*;

@Documented
@Constraint(validatedBy = ImageValidator.class)
@Target({ ElementType.FIELD, ElementType.PARAMETER, ElementType.TYPE_USE })
@Retention(RetentionPolicy.RUNTIME)
public @interface Image {

    String message() default "File is not a valid image.";

    Class<?>[] groups() default {};

    Class<? extends Payload>[] payload() default {};

    String[] allowedTypes() default {
        "image/jpeg",
        "image/png"
    };

    long maxSize() default 5 * 1024 * 1024; // 5MB
}
