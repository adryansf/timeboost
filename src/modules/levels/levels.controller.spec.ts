import { Test, TestingModule } from '@nestjs/testing';
import { Level } from '@prisma/client';
import { LevelsController } from './levels.controller';
import { LevelsService } from './levels.service';

// Dtos
import { CreateLevelDto } from './dto/create-level.dto';

describe('LevelsController', () => {
  let controller: LevelsController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [LevelsController],
      providers: [
        {
          provide: LevelsService,
          useValue: {
            create: () => {},
          },
        },
      ],
    }).compile();

    controller = module.get<LevelsController>(LevelsController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
