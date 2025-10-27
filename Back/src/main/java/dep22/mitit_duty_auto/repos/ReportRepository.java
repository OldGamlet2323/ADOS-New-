package dep22.mitit_duty_auto.repos;

import dep22.mitit_duty_auto.models.report.ListReport;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface ReportRepository extends JpaRepository<ListReport, Integer> {

    void deleteReportById(int id);

}
