package com.rkrs.bikethefttracker.security;

import io.jsonwebtoken.Claims;
import lombok.Getter;
import lombok.Setter;
import org.springframework.stereotype.Component;
import org.springframework.web.context.annotation.RequestScope;

@Component
@Getter @Setter
@RequestScope
public class JwtContext {
    private Claims claims;
}
