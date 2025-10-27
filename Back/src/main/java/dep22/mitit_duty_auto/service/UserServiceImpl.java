package dep22.mitit_duty_auto.service;

import dep22.mitit_duty_auto.dto.UserInfoDto;
import dep22.mitit_duty_auto.dto.UserRegistrationDto;
import dep22.mitit_duty_auto.entities.security.User;
import dep22.mitit_duty_auto.repos.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import java.util.Optional;

@Service
@RequiredArgsConstructor
public class UserServiceImpl implements UserService {

    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;

    @Override
    public UserInfoDto register(UserRegistrationDto dto) {
        User user = new User();
        user.setName(dto.getName());
        user.setRole(dto.getRole());
        user.setPassword(passwordEncoder.encode(dto.getPassword()));

        userRepository.save(user);
        return new UserInfoDto(user);
    }

    @Override
    public Optional<User> findByName(String name) {
        return userRepository.findByName(name);
    }

    @Override
    public Optional<UserInfoDto> authenticate(String name, String rawPassword) {
        return userRepository.findByName(name)
                .filter(user -> passwordEncoder.matches(rawPassword, user.getPassword()))
                .map(UserInfoDto::new);
    }
}