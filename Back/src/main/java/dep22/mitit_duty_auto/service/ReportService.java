package dep22.mitit_duty_auto.service;


import dep22.mitit_duty_auto.models.report.ListReport;
import dep22.mitit_duty_auto.repos.ReportRepository;
import jakarta.persistence.EntityNotFoundException;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Sort;
import org.springframework.stereotype.Service;

import java.time.LocalTime;
import java.time.format.DateTimeFormatter;
import java.util.Comparator;
import java.util.List;
import java.util.Optional;

@Service
public class ReportService  {

    private ReportRepository reportRepository;

    @Autowired
    public ReportService(ReportRepository reportRepository) {
        this.reportRepository = reportRepository;
    }

    public List<ListReport> getAllReports() {
        List<ListReport> reports = reportRepository.findAll();
        reports.sort(Comparator.comparing(this::parseTime).reversed());
        return reports;
    }

    private LocalTime parseTime(ListReport report) {
        String reportName = report.getReportName();
        if (reportName.contains("-")) {
            String[] times = reportName.split("-");
            return LocalTime.parse(times[0], DateTimeFormatter.ofPattern("HH:mm"));
        }
        return LocalTime.parse(reportName, DateTimeFormatter.ofPattern("HH:mm"));
    }

    public ListReport getReportById(int id) {
        return reportRepository.findById(id).get();
    }

    public ListReport saveReport(ListReport report) {
        return reportRepository.save(report);
    }

    public void deleteReportById(int id) {
        Optional<ListReport> report = reportRepository.findById(id);
        if (report.isPresent()) {
            reportRepository.delete(report.get());
        } else {
            throw new EntityNotFoundException("Report with ID " + id + " not found.");
        }
    }
}
