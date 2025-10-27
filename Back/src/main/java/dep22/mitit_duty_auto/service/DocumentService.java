package dep22.mitit_duty_auto.service;

import dep22.mitit_duty_auto.dto.DocumentDto;
import dep22.mitit_duty_auto.entities.Document;
import dep22.mitit_duty_auto.entities.enums.TypeOfDocument;
import dep22.mitit_duty_auto.entities.security.Roles;
import dep22.mitit_duty_auto.repos.DocumentRepository;
import jakarta.persistence.EntityNotFoundException;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.io.File;
import java.io.IOException;
import java.io.InputStream;
import java.nio.file.Files;
import java.nio.file.Paths;
import java.nio.file.StandardCopyOption;
import java.time.ZoneId; // FIX: Додано необхідний імпорт
import java.util.Comparator;
import java.util.Date;
import java.util.List;
import java.util.stream.Collectors;

@Slf4j
@Service
public class DocumentService {

    @Autowired
    private DocumentRepository documentRepository;

    private static final String UPLOAD_DIR = "uploads/";

    public DocumentDto saveDocument(MultipartFile file, TypeOfDocument typeOfDocument, String createBy, Roles sendTo) throws IOException {
        if (file.isEmpty()) {
            throw new IllegalArgumentException("Файл пустий. Будь ласка, оберіть документ.");
        }

        String originalFileName = file.getOriginalFilename();
        String cleanFileName = originalFileName.replaceAll("[^a-zA-Zа-яА-ЯёЁїЇіІєЄґҐ0-9\\.\\-]", "_");
        String uniqueFileName = System.currentTimeMillis() + "_" + cleanFileName;

        File uploadDir = new File(UPLOAD_DIR + "/" + typeOfDocument.name());
        if (!uploadDir.exists() && !uploadDir.mkdirs()) {
            throw new IOException("Не вдалося створити директорію для завантаження файлів: " + uploadDir.getAbsolutePath());
        }

        String documentPath = uploadDir.getAbsolutePath() + "/" + uniqueFileName;

        try (InputStream inputStream = file.getInputStream()) {
            Files.copy(inputStream, Paths.get(documentPath), StandardCopyOption.REPLACE_EXISTING);
        }

        Document documentEntity = new Document(
                cleanFileName,
                typeOfDocument,
                documentPath,
                false,
                new Date(),
                null,
                createBy,
                sendTo
        );

        documentEntity = documentRepository.save(documentEntity);

        // FIX: Повністю виправлено блок створення DTO
        DocumentDto documentDto = convertToDto(documentEntity);

        log.info("Документ успішно збережено: {}", documentDto);

        return documentDto;
    }

    public Document saveDocument(String title, TypeOfDocument type, String path, String createBy, Roles sendTo) {
        Document document = new Document();
        document.setTitle(title);
        document.setTypeOfDocument(type);
        document.setPath(path);
        document.setCreateBy(createBy);
        document.setSendTo(sendTo);
        document.setSendDate(new Date());

        return documentRepository.save(document);
    }

    public List<DocumentDto> getAllDocuments(Roles sendTo) {
        List<Document> documents = documentRepository.findBySendTo(sendTo);

        return documents.stream()
                .sorted(Comparator.comparing(Document::isRead))
                .map(this::convertToDto)
                .collect(Collectors.toList());
    }

    public Document markAsRead(Integer id) {
        Document document = documentRepository.findById(id)
                .orElseThrow(() -> new EntityNotFoundException("Документ не знайдено"));

        document.setRead(true);
        // FIX: Додаємо дату прочитання при відмітці
        document.setReadDate(new Date());

        return documentRepository.save(document); // FIX: Повертаємо оновлений документ з сервісу
    }

    // FIX: Винесено логіку конвертації в окремий приватний метод для перевикористання
    private DocumentDto convertToDto(Document document) {
        DocumentDto dto = new DocumentDto();
        dto.setId(document.getId());
        dto.setTitle(document.getTitle());
        dto.setPath(document.getPath());
        dto.setRead(document.isRead());
        dto.setCreateBy(document.getCreateBy());

        // FIX: Конвертуємо Enum в String
        if (document.getTypeOfDocument() != null) {
            dto.setTypeOfDocument(document.getTypeOfDocument().name());
        }
        if (document.getSendTo() != null) {
            dto.setSendTo(document.getSendTo().name());
        }

        // FIX: Конвертуємо java.util.Date в java.time.LocalDateTime
        if (document.getSendDate() != null) {
            dto.setSendDate(document.getSendDate().toInstant()
                    .atZone(ZoneId.systemDefault())
                    .toLocalDateTime());
        }

        // Поле readDate було видалено з DTO, тому ми його не встановлюємо
        // if (document.getReadDate() != null) {
        //     dto.setReadDate(document.getReadDate());
        // }

        return dto;
    }
}