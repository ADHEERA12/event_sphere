
package com.Eventsphere.project.security;

import io.jsonwebtoken.Jwts;
import io.jsonwebtoken.security.Keys;
import io.jsonwebtoken.io.Decoders;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;

import javax.crypto.SecretKey;
import java.util.Date;

@Service
public class JwtService {

    private final SecretKey key;

    public JwtService(@Value("${jwt.secret}") String secret) {
        this.key = Keys.hmacShaKeyFor(
                Decoders.BASE64.decode(secret)
        );
    }

    public String generateToken(String email) {
    return generateToken(email, false);
}

public String generateToken(String email, boolean rememberMe) {

    long expirationTime = rememberMe
            ? 7L * 24 * 60 * 60 * 1000
            : 24L * 60 * 60 * 1000;

    return Jwts.builder()
            .subject(email)
            .issuedAt(new Date())
            .expiration(new Date(System.currentTimeMillis() + expirationTime))
            .signWith(key)
            .compact();
}

    public String extractEmail(String token) {

        return Jwts.parser()
                .verifyWith(key)
                .build()
                .parseSignedClaims(token)
                .getPayload()
                .getSubject();
    }

    public boolean isTokenValid(String token, String email) {

        try {
            return extractEmail(token).equals(email);
        } catch (Exception e) {
            return false;
        }
    }
}
