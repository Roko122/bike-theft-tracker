package com.rkrs.bikethefttracker.config;

import org.springframework.context.annotation.Configuration;
import org.springframework.web.servlet.config.annotation.ResourceHandlerRegistry;
import org.springframework.web.servlet.config.annotation.WebMvcConfigurer;

@Configuration
public class WebConfig implements WebMvcConfigurer {

    @Override
    public void addResourceHandlers(ResourceHandlerRegistry registry) {
        registry.addResourceHandler("/images/bikes/**")
                .addResourceLocations("file:" + System.getProperty("user.dir") + "/images/bikes/");
        registry.addResourceHandler("/images/sightings/**")
                .addResourceLocations("file:" + System.getProperty("user.dir") + "/images/sightings/");
    }
}
