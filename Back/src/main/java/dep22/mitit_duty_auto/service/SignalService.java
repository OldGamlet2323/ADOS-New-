package dep22.mitit_duty_auto.service;

import dep22.mitit_duty_auto.models.signals.Signal;
import dep22.mitit_duty_auto.repos.SignalRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class SignalService {

    private final SignalRepository signalRepository;

    @Autowired
    public SignalService(SignalRepository signalRepository) {
        this.signalRepository = signalRepository;
    }

    public List<Signal> getAllSignals() {
        return signalRepository.findAll();
    }

    public Signal getSignalById(int id) {
        return signalRepository.findById(id).orElse(null);
    }

    public void deleteSignal(int id) {
        signalRepository.deleteById(id);
    }

    public Signal saveSignal(Signal signal) {
        // Do not set the ID; let the database handle it
        return signalRepository.save(signal);
    }
}
