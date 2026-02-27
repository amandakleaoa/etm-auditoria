package com.etm.app.services;

import com.etm.app.domain.user.User;
import io.jsonwebtoken.Claims;
import io.jsonwebtoken.security.Keys;
import io.jsonwebtoken.Jwts;
import io.jsonwebtoken.Jws;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;

import java.nio.charset.StandardCharsets;
import javax.crypto.SecretKey;
import java.util.Date;






@Service
public class TokenService {
	
	private final SecretKey signingKey;
	private final long expirationMs;
	
	public TokenService(
			@Value("${security.jwt.secret}") String secret,
			@Value("${security.jwt.expiration}") long expirationMs) {
		this.signingKey = Keys.hmacShaKeyFor(secret.getBytes(StandardCharsets.UTF_8));
		this.expirationMs = expirationMs;
	}
	
	public String generateToken(User user) {
		Date now = new Date();
		Date exp = new Date(now.getTime() + expirationMs);
		
		return Jwts.builder()
				.issuer("etm-backend")
				.subject(user.getUsername())
				.issuedAt(now)
				.expiration(exp)
				.signWith(signingKey)
				.compact();
	}
	
	public String extractSubject(String token) {
		Jws<Claims> jws = Jwts.parser()
				.verifyWith(signingKey)
				.build()
				.parseSignedClaims(token);
				
		return jws.getPayload().getSubject();
	}
	

}

