package dep22.mitit_duty_auto.service;

import dep22.mitit_duty_auto.dto.UserInfoDto;
import dep22.mitit_duty_auto.dto.UserRegistrationDto;
import dep22.mitit_duty_auto.entities.security.User;
import java.util.Optional;

public interface UserService {

    UserInfoDto register(UserRegistrationDto dto);

    Optional<User> findByName(String name);

    Optional<UserInfoDto> authenticate(String name, String rawPassword);

}