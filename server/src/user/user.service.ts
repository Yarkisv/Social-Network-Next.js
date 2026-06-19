import {
  Injectable,
  NotFoundException,
  UnauthorizedException,
} from "@nestjs/common";
import { CreateUserDto } from "./dto/create-user.dto";
import { InjectRepository } from "@nestjs/typeorm";
import { User } from "./entities/user.entity";
import { Like, Repository } from "typeorm";
import * as argon2 from "argon2";
import { UpdateUserDto } from "./dto/update-user.dto";
import { FileService } from "src/services/file.service";
import { SubscriptionService } from "src/subscription/subscription.service";
import { EPeriods } from "src/enums/statistics-period.enum";
import { Post } from "src/post/entities/post.entity";
import { Not } from "typeorm";

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(User) private readonly userRepository: Repository<User>,
    @InjectRepository(Post) private readonly postRepository: Repository<Post>,
    private readonly fileServise: FileService,
    private readonly subscriptionService: SubscriptionService,
  ) {}

  async create(createUserDto: CreateUserDto) {
    const isUserExist = await this.userRepository.findOne({
      where: {
        email: createUserDto.email,
      },
    });

    if (isUserExist) {
      throw new UnauthorizedException("This email already exists");
    }

    const user = await this.userRepository.save({
      fullname: createUserDto.fullname,
      username: createUserDto.username,
      email: createUserDto.email,
      phone: createUserDto.phone,
      password: await argon2.hash(createUserDto.password),
    });

    return { user };
  }

  async findOne(email: string) {
    return await this.userRepository.findOne({
      where: {
        email: email,
      },
    });
  }

  async findAll() {
    const users = await this.userRepository.find();

    if (users.length === 0) {
      throw new NotFoundException("Users not found");
    }

    const modifiedUsers = users.map((user) => {
      const { password, ...rest } = user;
      return rest;
    });

    return modifiedUsers;
  }

  async findOriginalById(id: number) {
    const user = await this.userRepository.findOne({
      where: {
        user_id: id,
      },
      select: [
        "user_id",
        "fullname",
        "username",
        "email",
        "phone",
        "description",
        "avatarPathTo",
      ],
      relations: [
        "chatMemberships",
        "sentMessages",
        "posts",
        "subscribers",
        "subscriptions",
      ],
    });

    return { user };
  }

  async findByUsername(username: string) {
    const user = await this.userRepository.findOne({
      where: { username: username },
    });

    if (!user) {
      throw new NotFoundException("User not found 404");
    }

    const {
      password,
      subscriptions,
      subscribers,
      posts,
      chatMemberships,
      sentMessages,
      comments,
      Likes,
      ...modifiedUser
    } = user;

    return modifiedUser;
  }

  async findUsersBySymbol(string: string) {
    const users = await this.userRepository.find({
      where: {
        username: Like(`${string}%`),
      },
    });

    if (users.length === 0) {
      throw new NotFoundException("Users not found 404");
    }

    const modifiedUsers = await Promise.all(
      users.map(
        async ({
          password,
          subscriptions,
          subscribers,
          chatMemberships,
          sentMessages,
          posts,
          comments,
          Likes,
          ...rest
        }) => {
          return {
            ...rest,
          };
        },
      ),
    );

    return modifiedUsers;
  }

  async findFullDataById(id: number) {
    const user = await this.userRepository.findOne({
      where: {
        user_id: id,
      },
      select: [
        "user_id",
        "fullname",
        "username",
        "email",
        "phone",
        "description",
        "avatarPathTo",
        "isPrivate",
      ],
      relations: ["posts", "subscribers", "subscriptions"],
    });

    if (!user) {
      throw new NotFoundException("User not found");
    }
    return user;
  }

  async findBasicDataById(user_id: number) {
    const user = await this.userRepository.findOne({
      where: {
        user_id: user_id,
      },
      select: [
        "user_id",
        "fullname",
        "username",
        "email",
        "phone",
        "description",
        "avatarPathTo",
      ],
    });

    if (!user) {
      throw new NotFoundException("User not found");
    }

    return user;
  }

  async updateUser(
    id: number,
    updateUserDto: UpdateUserDto,
    file: Express.Multer.File,
  ) {
    const user = await this.userRepository.findOne({
      where: {
        user_id: id,
      },
      select: [
        "user_id",
        "fullname",
        "username",
        "email",
        "phone",
        "description",
        "avatarPathTo",
      ],
    });

    if (!user) {
      throw new NotFoundException();
    }

    if (updateUserDto.fullname !== undefined) {
      user.fullname = updateUserDto.fullname;
    }

    if (updateUserDto.username !== undefined) {
      user.username = updateUserDto.username;
    }

    if (updateUserDto.phone !== undefined) {
      user.phone = updateUserDto.phone;
    }

    if (updateUserDto.email !== undefined) {
      user.email = updateUserDto.email;
    }

    if (updateUserDto.description !== undefined) {
      user.description = updateUserDto.description;
    }

    if (file) {
      const pathTo: string = await this.fileServise.uploadFile(
        file,
        user.username.toString(),
      );

      console.log(pathTo);

      user.avatarPathTo = pathTo;
    }

    const updatedUser = await this.userRepository.save(user);

    console.log(updatedUser);

    return updatedUser;
  }

  async getStatistics(user_id: number, period: EPeriods) {
    const { subscriptions, subscribers } =
      await this.subscriptionService.findAllById(user_id);

    const localDate = new Date();

    switch (period) {
      case EPeriods.DAY:
        const subscribersSinceToday = subscribers.filter(
          (sub) => new Date(sub.subscriptionSince) == localDate,
        );

        console.log(subscribersSinceToday);

        return {
          subsSinceToday: subscribersSinceToday,
          subsSinceTodayCount: subscribersSinceToday.length,
        };
      case EPeriods.WEEK:
        const weekAgo = new Date();
        weekAgo.setDate(new Date().getDate() - 7);

        const subscribersSinceLastWeek = subscribers.filter(
          (sub) => new Date(sub.subscriptionSince) >= weekAgo,
        );

        console.log(subscribersSinceLastWeek);

        return {
          subsSinceLastWeek: subscribersSinceLastWeek,
          subsSinceLastWeekCount: subscribersSinceLastWeek.length,
        };
      case EPeriods.MONTH:
        const monthAgo = new Date();
        monthAgo.setDate(new Date().getDate() - 30);

        const subscribersSinceLastMonth = subscribers.filter(
          (sub) => new Date(sub.subscriptionSince) >= monthAgo,
        );

        console.log(subscribersSinceLastMonth);

        return {
          subsSinceLastMonth: subscribersSinceLastMonth,
          subsSinceLastMontthCount: subscribersSinceLastMonth.length,
        };
    }
  }

  async togglePrivacy(user_id: number) {
    const user = await this.userRepository.findOne({
      where: { user_id: user_id },
    });

    if (!user) {
      throw new NotFoundException("User not found");
    }

    user.isPrivate = !user.isPrivate;

    await this.userRepository.save(user);

    return {
      isPrivate: user.isPrivate,
    };
  }

  async getUserPrivacy(user_id: number) {
    const user = await this.userRepository.findOne({
      where: { user_id: user_id },
    });

    if (!user) {
      throw new NotFoundException("User not found");
    }

    return user.isPrivate;
  }

  async updateInterests(user_id: number, interests: string[]) {
    const user = await this.userRepository.findOne({
      where: { user_id },
    });

    if (!user) {
      throw new NotFoundException("User not found");
    }

    user.interests = [...new Set(interests)];

    await this.userRepository.save(user);

    return {
      message: "Interests updated successfully",
      interests: user.interests,
    };
  }

  async getRecomendations(user_id: number) {
    console.log("НАЧАЛО ПОЛУЧЕНИЯ РЕКОМЕНДАЦИЙ ДЛЯ ПОЛЬЗОВАТЕЛЯ", user_id);

    const user = await this.userRepository.findOne({
      where: { user_id },
    });

    if (!user) {
      console.log("ОШИБКА ПОЛЬЗОВАТЕЛЬ НЕ НАЙДЕН", user_id);
      throw new NotFoundException("User not found");
    }

    console.log("ПОЛЬЗОВАТЕЛЬ НАЙДЕН", user_id, "ИМЯ", user.username);

    const interests: string[] = Array.isArray(user.interests)
      ? user.interests.map((i) => i.toLowerCase().trim())
      : [];

    console.log("ИНТЕРЕСЫ ПОЛЬЗОВАТЕЛЯ", interests);
    console.log("КОЛИЧЕСТВО ИНТЕРЕСОВ", interests.length);

    const interestsSet = new Set(interests);
    console.log("СЕТ ИНТЕРЕСОВ СОЗДАН", Array.from(interestsSet));

    console.log("ПОЛУЧЕНИЕ ПОДПИСОК ПОЛЬЗОВАТЕЛЯ", user_id);
    const { subscriptions } =
      await this.subscriptionService.findAllById(user_id);

    console.log("КОЛИЧЕСТВО ПОДПИСОК", subscriptions.length);
    console.log(
      "СПИСОК ID ПОДПИСОК",
      subscriptions.map((u) => u.user_id),
    );

    const followingIds = new Set(subscriptions.map((u) => u.user_id));
    console.log("СЕТ ID ПОДПИСОК СОЗДАН", Array.from(followingIds));

    console.log("ЗАПРОС ПОСТОВ ИЗ БАЗЫ ДАННЫХ");
    const posts = await this.postRepository.find({
      relations: ["user", "images", "likes", "comments"],
      where: {
        user: { user_id: Not(user_id) },
      },
      order: { created_at: "DESC" },
      take: 150,
    });

    console.log("ПОЛУЧЕНО ПОСТОВ", posts.length);
    console.log(
      "ID ВСЕХ ПОЛУЧЕННЫХ ПОСТОВ",
      posts.map((p) => p.post_id),
    );

    const hasInterests = interests.length > 0;
    const hasFollowings = followingIds.size > 0;
    const onlyFollowingMode = !hasInterests && hasFollowings;

    console.log("ЕСТЬ ИНТЕРЕСЫ", hasInterests);
    console.log("ЕСТЬ ПОДПИСКИ", hasFollowings);
    console.log("РЕЖИМ ТОЛЬКО ПОДПИСКИ", onlyFollowingMode);

    if (!hasInterests && !hasFollowings) {
      console.log("НЕТ НИ ИНТЕРЕСОВ НИ ПОДПИСОК ВОЗВРАЩАЕМ ПУСТОЙ МАССИВ");
      return [];
    }

    console.log("НАЧАЛО ФИЛЬТРАЦИИ ПОСТОВ");
    const filteredPosts = posts.filter((post) => {
      console.log("ПРОВЕРКА ПОСТА", post.post_id, "НАЗВАНИЕ", post.post_title);

      const isFromFollowing = followingIds.has(post.user.user_id);
      console.log(
        "ПОСТ ОТ ПОДПИСКИ",
        isFromFollowing,
        "АВТОР",
        post.user.user_id,
      );

      if (onlyFollowingMode) {
        console.log("РЕЖИМ ТОЛЬКО ПОДПИСКИ РЕЗУЛЬТАТ", isFromFollowing);
        return isFromFollowing;
      }

      if (hasInterests) {
        console.log("ПРОВЕРКА ИНТЕРЕСОВ ДЛЯ ПОСТА", post.post_id);

        const tags = Array.isArray(post.aiTags)
          ? post.aiTags.map((tag) => tag.toLowerCase().trim())
          : [];

        console.log("ТЕГИ ПОСТА", tags);
        console.log("КОЛИЧЕСТВО ТЕГОВ", tags.length);

        const hasMatchingInterest = tags.some((tag) => {
          const isMatch = interestsSet.has(tag);
          if (isMatch) {
            console.log("НАЙДЕНО СОВПАДЕНИЕ ТЕГ", tag, "С ИНТЕРЕСОМ");
          }
          return isMatch;
        });

        console.log("ЕСТЬ СОВПАДЕНИЕ С ИНТЕРЕСАМИ", hasMatchingInterest);
        console.log("РЕЗУЛЬТАТ ФИЛЬТРАЦИИ ПОСТА", hasMatchingInterest);
        return hasMatchingInterest;
      }

      console.log("ПОСТ НЕ ПРОШЕЛ ФИЛЬТРАЦИЮ");
      return false;
    });

    console.log("ОТФИЛЬТРОВАНО ПОСТОВ", filteredPosts.length);
    console.log(
      "ID ОТФИЛЬТРОВАННЫХ ПОСТОВ",
      filteredPosts.map((p) => p.post_id),
    );

    console.log("СОРТИРОВКА ПОСТОВ СНАЧАЛА ПОДПИСКИ");
    const sortedPosts = filteredPosts.sort((a, b) => {
      const aIsFollowing = followingIds.has(a.user.user_id);
      const bIsFollowing = followingIds.has(b.user.user_id);

      console.log(
        "СРАВНЕНИЕ ПОСТОВ",
        a.post_id,
        "ПОДПИСКА",
        aIsFollowing,
        b.post_id,
        "ПОДПИСКА",
        bIsFollowing,
      );

      if (aIsFollowing && !bIsFollowing) {
        console.log("ПОСТ", a.post_id, "ИДЕТ ПЕРВЫМ КАК ПОДПИСКА");
        return -1;
      }
      if (!aIsFollowing && bIsFollowing) {
        console.log("ПОСТ", b.post_id, "ИДЕТ ПЕРВЫМ КАК ПОДПИСКА");
        return 1;
      }
      return 0;
    });

    console.log("ПОСЛЕ СОРТИРОВКИ ПОСТОВ", sortedPosts.length);
    console.log(
      "ПОРЯДОК ПОСТОВ ПОСЛЕ СОРТИРОВКИ",
      sortedPosts.map((p) => p.post_id),
    );

    const result = sortedPosts.map((post) => {
      const matchedTags =
        post.aiTags?.filter((tag) =>
          interestsSet.has(tag.toLowerCase().trim()),
        ) || [];

      console.log(
        "ДЛЯ ПОСТА",
        post.post_id,
        "НАЙДЕНО СОВПАДАЮЩИХ ТЕГОВ",
        matchedTags.length,
        matchedTags,
      );

      return {
        post_id: post.post_id,
        post_title: post.post_title,
        images: post.images,
        username: post.user.username,
        userAvatar: post.user.avatarPathTo,
        comments: post.comments || [],
        likes: post.likes || [],
        isFromFollowing: followingIds.has(post.user.user_id),
        matchedInterests: matchedTags,
      };
    });

    console.log("ИТОГОВО РЕКОМЕНДАЦИЙ ПОЛУЧЕНО", result.length);
    console.log("ЗАВЕРШЕНИЕ ПОЛУЧЕНИЯ РЕКОМЕНДАЦИЙ");

    return result;
  }

  async getInterests(user_id: number) {
    const user = await this.userRepository.findOne({
      where: { user_id },
    });

    if (!user) {
      throw new NotFoundException("User not found");
    }

    const interestsSet = user.interests || [];

    return interestsSet;
  }

  async clearInterests(user_id: number) {
    const user = await this.userRepository.findOne({
      where: { user_id },
    });

    if (!user) {
      throw new NotFoundException("User not found");
    }

    user.interests = [];

    await this.userRepository.save(user);
  }
}
