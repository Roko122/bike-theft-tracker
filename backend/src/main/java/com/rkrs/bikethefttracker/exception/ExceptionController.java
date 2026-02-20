package com.rkrs.bikethefttracker.exception;

import com.rkrs.bikethefttracker.dto.ErrorResponse;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.MethodArgumentNotValidException;
import org.springframework.web.bind.UnsatisfiedServletRequestParameterException;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.ResponseStatus;
import org.springframework.web.bind.annotation.RestControllerAdvice;
import org.springframework.web.method.annotation.MethodArgumentTypeMismatchException;

import java.util.Arrays;

@RestControllerAdvice
@Slf4j
public class ExceptionController {

    @ExceptionHandler(Exception.class)
    @ResponseStatus(HttpStatus.INTERNAL_SERVER_ERROR)
    public ErrorResponse handleException(Exception ex) {
        HttpStatus httpStatus = HttpStatus.INTERNAL_SERVER_ERROR;
        log.error("Exception handled:", ex);

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
        log.warn(ex.getMessage());

        return new ErrorResponse(
                httpStatus.getReasonPhrase(),
                httpStatus.value(),
                ex.getMessage()
        );
    }

    @ExceptionHandler(MethodArgumentNotValidException.class)
    @ResponseStatus(HttpStatus.BAD_REQUEST)
    public ErrorResponse handleNotFoundException(MethodArgumentNotValidException ex) {
        HttpStatus httpStatus = HttpStatus.BAD_REQUEST;
        log.warn(ex.getMessage());

        return new ErrorResponse(
                httpStatus.getReasonPhrase(),
                httpStatus.value(),
                ex.getBindingResult().getFieldError().getDefaultMessage()
        );
    }

    @ExceptionHandler(UnsatisfiedServletRequestParameterException.class)
    @ResponseStatus(HttpStatus.BAD_REQUEST)
    public ErrorResponse handleUnsatisfiedServletRequestParameterException(UnsatisfiedServletRequestParameterException ex) {
        HttpStatus httpStatus = HttpStatus.BAD_REQUEST;
        log.warn(ex.getMessage());

        return new ErrorResponse(
                httpStatus.getReasonPhrase(),
                httpStatus.value(),
                "Invalid number of request parameters."
        );
    }

    @ExceptionHandler(MethodArgumentTypeMismatchException.class)
    @ResponseStatus(HttpStatus.BAD_REQUEST)
    public ErrorResponse handleMethodArgumentTypeMismatchExceptionException(MethodArgumentTypeMismatchException ex) {
        HttpStatus httpStatus = HttpStatus.BAD_REQUEST;
        log.warn(ex.getMessage());

        return new ErrorResponse(
                httpStatus.getReasonPhrase(),
                httpStatus.value(),
                String.format(
                        "Invalid value '%s' for parameter '%s'.",
                        ex.getValue(),
                        ex.getName()
                )
        );
    }
}
