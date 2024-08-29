import { Test, TestingModule } from '@nestjs/testing';
import { LevelsService } from './levels.service';
import { LevelRepository } from './repository/level.repository';
import { CreateLevelDto } from './dto/create-level.dto';
import { UpdateLevelDto } from './dto/update-level.dto';
import { NotFoundException } from '@nestjs/common';
import { MESSAGES } from '@/utils/messages';

describe('LevelsService', () => {
  let service: LevelsService;
  let repository: LevelRepository;

  const mockLevelRepository = {
    create: jest.fn((dto) => {
      return {
        id: 1,
        ...dto,
      };
    }),
    findAll: jest.fn(() => [
      { id: 1, name: 'Level 1', pointsRequired: 100 },
      { id: 2, name: 'Level 2', pointsRequired: 200 },
    ]),
    findById: jest.fn((id) => {
      if (id === 1) {
        return Promise.resolve({ id: 1, name: 'Level 1', pointsRequired: 100 });
      } else {
        return Promise.resolve(null);
      }
    }),
    update: jest.fn((id, dto) => ({ id, ...dto })),
    delete: jest.fn((id) => ({ id, name: 'Deleted Level', pointsRequired: 0 })),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        LevelsService,
        {
          provide: LevelRepository,
          useValue: mockLevelRepository,
        },
      ],
    }).compile();

    service = module.get<LevelsService>(LevelsService);
    repository = module.get<LevelRepository>(LevelRepository);
  });

  it('should be defined', () => {
    // Assert
    expect(service).toBeDefined();
  });

  it('should create a level', async () => {
    // Arrange
    const createLevelDto: CreateLevelDto = {
      name: 'Level 1',
      pointsRequired: 100,
    };

    // Act
    const result = await service.create(createLevelDto);

    // Assert
    expect(result).toEqual({
      id: expect.any(Number),
      name: 'Level 1',
      pointsRequired: 100,
    });
    expect(repository.create).toHaveBeenCalledWith(createLevelDto);
  });

  it('should return an array of levels', async () => {
    // Act
    const result = await service.findAll();

    // Assert
    expect(repository.findAll).toHaveBeenCalled();
    expect(result).toEqual([
      { id: 1, name: 'Level 1', pointsRequired: 100 },
      { id: 2, name: 'Level 2', pointsRequired: 200 },
    ]);
  });

  it('should update a level', async () => {
    // Arrange
    const id = 1;
    const updateLevelDto: UpdateLevelDto = {
      name: 'Updated Level',
      pointsRequired: 150,
    };

    // Act
    const result = await service.update(id, updateLevelDto);

    // Assert
    expect(repository.update).toHaveBeenCalledWith(id, updateLevelDto);
    expect(result).toEqual({
      id: 1,
      name: 'Updated Level',
      pointsRequired: 150,
    });
  });

  it('should throw NotFoundException if level not found during update', async () => {
    // Arrange
    const updateLevelDto: UpdateLevelDto = {
      name: 'Updated Level',
      pointsRequired: 150,
    };

    // Act & Assert
    await expect(service.update(2, updateLevelDto)).rejects.toThrow(
      new NotFoundException(MESSAGES.exception.level.NotFound),
    );
  });

  it('should delete a level', async () => {
    // Act
    const result = await service.remove(1);

    // Assert
    expect(result).toEqual({
      id: 1,
      name: 'Deleted Level',
      pointsRequired: 0,
    });
    expect(repository.delete).toHaveBeenCalledWith(1);
  });

  it('should throw NotFoundException if level not found during deletion', async () => {
    // Act & Assert
    await expect(service.remove(2)).rejects.toThrow(
      new NotFoundException(MESSAGES.exception.level.NotFound),
    );
  });
});
