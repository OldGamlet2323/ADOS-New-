package dep22.mitit_duty_auto.service;


import dep22.mitit_duty_auto.models.instruction.Instruction;
import dep22.mitit_duty_auto.repos.InstructionRepository;
import jakarta.persistence.EntityNotFoundException;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Sort;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
public class InstructionService  {

    private InstructionRepository instructionRepository;

    @Autowired
    public InstructionService(InstructionRepository instructionRepository) {
        this.instructionRepository = instructionRepository;
    }

    public List<Instruction> getAllInstructions() {
        return instructionRepository.findAll(Sort.by(Sort.Direction.DESC, "name"));
    }

    public Instruction getInstructionById(int id) {
        return instructionRepository.findById(id).get();
    }

    public Instruction deleteInstruction(int id) {
        Optional<Instruction> instruction = instructionRepository.findById(id);
        if (instruction.isPresent()) {
            instructionRepository.deleteById(id);
            return instruction.get();
        } else {
            throw new EntityNotFoundException("Instruction with ID " + id + " not found.");
        }
    }


    public Instruction saveInstruction(Instruction instruction) {
        return instructionRepository.save(instruction);
    }

}
