package com.rkrs.bikethefttracker.exception;

import com.rkrs.bikethefttracker.dto.ErrorResponse;
import lombok.extern.slf4j.Slf4j;
import org.springframework.dao.DataIntegrityViolationException;
import org.springframework.http.HttpStatus;
import org.springframework.security.authentication.BadCredentialsException;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.web.bind.MethodArgumentNotValidException;
import org.springframework.web.bind.UnsatisfiedServletRequestParameterException;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.ResponseStatus;
import org.springframework.web.bind.annotation.RestControllerAdvice;
import org.springframework.web.method.annotation.MethodArgumentTypeMismatchException;
import org.springframework.web.servlet.resource.NoResourceFoundException;

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

    @ExceptionHandler(UserAlreadyExistsException.class)
    @ResponseStatus(HttpStatus.CONFLICT)
    public ErrorResponse handleUserAlreadyExistsException(UserAlreadyExistsException ex) {
        HttpStatus httpStatus = HttpStatus.CONFLICT;
        log.warn(ex.getMessage());

        return new ErrorResponse(
                httpStatus.getReasonPhrase(),
                httpStatus.value(),
                ex.getMessage()
        );
    }

    @ExceptionHandler(InvalidRefreshTokenException.class)
    @ResponseStatus(HttpStatus.UNAUTHORIZED)
    public ErrorResponse handleInvalidRefreshTokenException(InvalidRefreshTokenException ex) {
        HttpStatus httpStatus = HttpStatus.UNAUTHORIZED;
        log.warn(ex.getMessage());

        return new ErrorResponse(
                httpStatus.getReasonPhrase(),
                httpStatus.value(),
                ex.getMessage()
        );
    }

    @ExceptionHandler(IllegalArgumentException.class)
    @ResponseStatus(HttpStatus.BAD_REQUEST)
    public ErrorResponse handleIllegalArgumentException(IllegalArgumentException ex) {
        HttpStatus httpStatus = HttpStatus.BAD_REQUEST;
        log.warn(ex.getMessage());

        return new ErrorResponse(
                httpStatus.getReasonPhrase(),
                httpStatus.value(),
                ex.getMessage()
        );
    }

    @ExceptionHandler(NoResourceFoundException.class)
    @ResponseStatus(HttpStatus.NOT_FOUND)
    public ErrorResponse handleNoResourceFoundException(NoResourceFoundException ex) {
        HttpStatus httpStatus = HttpStatus.NOT_FOUND;
        log.warn(ex.getMessage());

        return new ErrorResponse(
                httpStatus.getReasonPhrase(),
                httpStatus.value(),
                "Resource not found."
        );
    }

    @ExceptionHandler(BadCredentialsException.class)
    @ResponseStatus(HttpStatus.UNAUTHORIZED)
    public ErrorResponse handleBadCredentialsException(BadCredentialsException ex) {
        HttpStatus httpStatus = HttpStatus.UNAUTHORIZED;
        log.warn(ex.getMessage());

        return new ErrorResponse(
                httpStatus.getReasonPhrase(),
                httpStatus.value(),
                "Invalid username or password."
        );
    }

    @ExceptionHandler(UsernameNotFoundException.class)
    @ResponseStatus(HttpStatus.UNAUTHORIZED)
    public ErrorResponse handleUsernameNotFoundException(UsernameNotFoundException ex) {
        HttpStatus httpStatus = HttpStatus.UNAUTHORIZED;
        log.warn(ex.getMessage());

        return new ErrorResponse(
                httpStatus.getReasonPhrase(),
                httpStatus.value(),
                "Invalid username or password."
        );
    }

    @ExceptionHandler(InvalidImageException.class)
    @ResponseStatus(HttpStatus.BAD_REQUEST)
    public ErrorResponse handleUsernameNotFoundException(InvalidImageException ex) {
        HttpStatus httpStatus = HttpStatus.BAD_REQUEST;
        log.warn(ex.getMessage());

        return new ErrorResponse(
                httpStatus.getReasonPhrase(),
                httpStatus.value(),
                ex.getMessage()
        );
    }

    @ExceptionHandler(AccessDeniedException.class)
    @ResponseStatus(HttpStatus.FORBIDDEN)
    public ErrorResponse handleAccessDeniedException(AccessDeniedException ex) {
        HttpStatus httpStatus = HttpStatus.FORBIDDEN;
        log.warn(ex.getMessage());

        return new ErrorResponse(
                httpStatus.getReasonPhrase(),
                httpStatus.value(),
                ex.getMessage()
        );
    }

    @ExceptionHandler(DataIntegrityViolationException.class)
    @ResponseStatus(HttpStatus.CONFLICT)
    public ErrorResponse handleDataIntegrityViolationException(DataIntegrityViolationException ex) {
        HttpStatus httpStatus = HttpStatus.CONFLICT;
        log.warn(ex.getMessage());

        return new ErrorResponse(
                httpStatus.getReasonPhrase(),
                httpStatus.value(),
                "Request could not be completed due to a data conflict"
        );
    }
}
