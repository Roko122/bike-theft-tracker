package com.rkrs.bikethefttracker.service;

import lombok.extern.slf4j.Slf4j;
import net.coobird.thumbnailator.Thumbnails;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import javax.imageio.ImageIO;
import java.awt.image.BufferedImage;
import java.io.File;
import java.io.IOException;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.util.ArrayList;
import java.util.List;
import java.util.UUID;

@Service
@Slf4j
public class ImageStorageService {
    private static final int MAX_WIDTH = 1280;
    private static final String PROJECT_ROOT = System.getProperty("user.dir");

    public List<String> saveImages(List<MultipartFile> images, UUID bikeId) {
        if (images.size() > 5) {
            throw new IllegalArgumentException("Maximum 5 images allowed");
        }

        File bikeFolder = this.createFolder(bikeId);

        return handleImages(images, bikeFolder);
    }

    private List<String> handleImages(List<MultipartFile> images, File bikeFolder) {
        List<String> imagePaths = new ArrayList<>();

        for (MultipartFile image : images) {
            String imagePath = this.handleImage(image, bikeFolder);
            imagePaths.add(imagePath);
        }

        return imagePaths;
    }

    private String handleImage(MultipartFile image, File bikeFolder) {
        String imageName = UUID.randomUUID() + ".jpeg";

        try {
            this.saveImage(image, bikeFolder, imageName);
        } catch (IOException e) {
            log.warn("Something went wrong when trying to save image {}", image.getOriginalFilename());
        }

        return imageName;
    }

    private void saveImage(MultipartFile image, File bikeFolder, String imageName) throws IOException {
        File outputFile = new File(bikeFolder, imageName);

        BufferedImage bi = ImageIO.read(image.getInputStream());
        if (bi.getWidth() > MAX_WIDTH) {
            Thumbnails.of(image.getInputStream())
                    .width(MAX_WIDTH)
                    .outputFormat("jpeg")
                    .toFile(outputFile);
        } else {
            Thumbnails.of(image.getInputStream())
                    .scale(1.0)
                    .outputFormat("jpeg")
                    .toFile(outputFile);
        }
    }

    private File createFolder(UUID bikeId) {
        Path bikeFolderPath = Paths.get(PROJECT_ROOT, "images", "bikes", bikeId.toString());
        File dir = bikeFolderPath.toFile();
        if (!dir.exists()) {
            dir.mkdirs();
        }

        return dir;
    }
}
