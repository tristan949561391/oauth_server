import { TestBed, inject } from '@angular/core/testing';

import { ClientValidateService } from './client-validate.service';

describe('ClientValidateService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [ClientValidateService]
    });
  });

  it('should ...', inject([ClientValidateService], (service: ClientValidateService) => {
    expect(service).toBeTruthy();
  }));
});
