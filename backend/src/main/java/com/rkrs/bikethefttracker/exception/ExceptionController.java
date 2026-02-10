package com.rkrs.bikethefttracker.exception;

import com.rkrs.bikethefttracker.dto.ErrorResponse;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.ResponseStatus;
import org.springframework.web.bind.annotation.RestControllerAdvice;

@RestControllerAdvice
public class ExceptionController {

    @ExceptionHandler(Exception.class)
    @ResponseStatus(HttpStatus.INTERNAL_SERVER_ERROR)
    public ErrorResponse handleException() {
        HttpStatus httpStatus = HttpStatus.INTERNAL_SERVER_ERROR;

        return new ErrorResponse(
                httpStatus.getReasonPhrase(),
                httpStatus.value(),
                "An unexpected error occurred"
        );
    }

    @ExceptionHandler(NotFoundException.class)
    @ResponseStatus(HttpStatus.NOT_FOUND)
    public ErrorResponse handleNotFoundException(NotFoundException ex) {
        HttpStatus httpStatus = HttpStatus.NOT_FOUND;

        return new ErrorResponse(
                httpStatus.getReasonPhrase(),
                httpStatus.value(),
                ex.getMessage()
        );
    }
}
