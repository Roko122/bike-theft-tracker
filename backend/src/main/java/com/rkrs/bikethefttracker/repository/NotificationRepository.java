package com.rkrs.bikethefttracker.repository;

import com.rkrs.bikethefttracker.entity.Notification;
import com.rkrs.bikethefttracker.entity.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;
import java.util.UUID;

@Repository
public interface NotificationRepository extends JpaRepository<Notification, UUID> {
    Optional<Notification> findByIdAndRecipient(UUID notificationId, User recipient);

    List<Notification> findByRecipientAndReadFalse(User user);

    int countByRecipientAndReadFalse(User user);
}
