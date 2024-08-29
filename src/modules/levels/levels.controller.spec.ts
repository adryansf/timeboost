import { Test, TestingModule } from '@nestjs/testing';
import { LevelsController } from './levels.controller';
import { LevelsService } from './levels.service';
import { CreateLevelDto } from './dto/create-level.dto';
import { UpdateLevelDto } from './dto/update-level.dto';
import { LevelEntity } from './entities/level.entity';

describe('LevelsController', () => {
  let controller: LevelsController;
  let service: LevelsService;

  const mockLevelsService = {
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
    update: jest.fn(() => {}),
    remove: jest.fn(() => {}),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [LevelsController],
      providers: [
        {
          provide: LevelsService,
          useValue: mockLevelsService,
        },
      ],
    }).compile();

    controller = module.get<LevelsController>(LevelsController);
    service = module.get<LevelsService>(LevelsService);
  });

  it('should be defined', () => {
    // Assert
    expect(controller).toBeDefined();
  });

  it('should create a level', async () => {
    // Arrange
    const createLevelDto: CreateLevelDto = {
      name: 'Level 1',
      pointsRequired: 100,
    };

    // Act
    const result = await controller.create(createLevelDto);

    // Assert
    expect(result).toEqual(
      new LevelEntity({
        id: expect.any(Number),
        name: createLevelDto.name,
        pointsRequired: createLevelDto.pointsRequired,
      }),
    );
    expect(service.create).toHaveBeenCalledWith(createLevelDto);
  });

  it('should return an array of levels', async () => {
    // Act
    const result = await controller.findAll();

    // Assert
    expect(result).toEqual([
      new LevelEntity({ id: 1, name: 'Level 1', pointsRequired: 100 }),
      new LevelEntity({ id: 2, name: 'Level 2', pointsRequired: 200 }),
    ]);
  });

  it('should update a level', async () => {
    // Arrange
    const updateLevelDto: UpdateLevelDto = {
      name: 'Level Updated',
      pointsRequired: 150,
    };

    // Act
    await controller.update('1', updateLevelDto);

    // Assert
    expect(service.update).toHaveBeenCalledWith(1, updateLevelDto);
  });

  it('should delete a level', async () => {
    // Act
    await controller.remove('1');

    // Assert
    expect(service.remove).toHaveBeenCalledWith(1);
  });
});
