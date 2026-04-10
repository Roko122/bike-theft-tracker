package com.rkrs.bikethefttracker.service;

import com.rkrs.bikethefttracker.exception.InvalidImageException;
import lombok.extern.slf4j.Slf4j;
import net.coobird.thumbnailator.Thumbnails;
import org.springframework.stereotype.Service;
import org.springframework.util.FileSystemUtils;
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

    public String saveImage(MultipartFile image, String folderName, UUID id) {
        File folder = this.createFolder(folderName, id);

        try {
            return this.handleImage(image, folder);
        } catch (IOException e) {
            log.warn("Something went wrong when trying to save image {}", image.getOriginalFilename());
            throw new InvalidImageException("Invalid image.");
        }
    }

    public List<String> saveImages(List<MultipartFile> images, String folderName, UUID id) {
        File folder = this.createFolder(folderName, id);

        return handleImages(images, folder);
    }

    public boolean deleteImages(UUID id) {
        File file = new File(PROJECT_ROOT + "/images/theft-reports/" + id);
        return FileSystemUtils.deleteRecursively(file);
    }

    private List<String> handleImages(List<MultipartFile> images, File folder) {
        List<String> imagePaths = new ArrayList<>();

        for (MultipartFile image : images) {
            try {
                String imagePath = this.handleImage(image, folder);
                imagePaths.add(imagePath);
            } catch (IOException e) {
                log.warn("Something went wrong when trying to save image {}", image.getOriginalFilename());
            }
        }

        return imagePaths;
    }

    private String handleImage(MultipartFile image, File folder) throws IOException {
        String imageName = UUID.randomUUID() + ".jpeg";
        this.saveImage(image, folder, imageName);

        return imageName;
    }

    private void saveImage(MultipartFile image, File folder, String imageName) throws IOException {
        File outputFile = new File(folder, imageName);

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

    private File createFolder(String folderName, UUID id) {
        Path bikeFolderPath = Paths.get(PROJECT_ROOT, "images", "theft-reports", id.toString(), folderName);
        File dir = bikeFolderPath.toFile();
        if (!dir.exists()) {
            dir.mkdirs();
        }

        return dir;
    }
}
