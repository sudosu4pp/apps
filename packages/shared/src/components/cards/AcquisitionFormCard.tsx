import React, { ReactElement } from 'react';

import { Card } from './Card';

export const acquisitionKey = 'ua';

export function AcquisitionFormCard(): ReactElement {
  return (
    <Card data-testid="acquisitionFormCard" className="p-4">
      How did you hear about us?
    </Card>
  );
}
