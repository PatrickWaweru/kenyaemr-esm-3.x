import React, { useMemo, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { StructuredListSkeleton, ContentSwitcher, Switch, type SwitchEventHandlersParams } from '@carbon/react';
import styles from './care-panel.scss';
import { useEnrollmentHistory } from '../hooks/useEnrollmentHistory';
import ProgramSummary from '../program-summary/program-summary.component';
import ProgramEnrollment from '../program-enrollment/program-enrollment.component';
import { CardHeader, EmptyState } from '@openmrs/esm-patient-common-lib';
import RegimenHistory from '../regimen/regimen-history.component';
import first from 'lodash/first';
import sortBy from 'lodash/sortBy';
import { ErrorState } from '@openmrs/esm-framework';

type CarePanelProps = {
  patientUuid: string;
  formEntrySub: any;
};

const CarePanel: React.FC<CarePanelProps> = ({ patientUuid, formEntrySub }) => {
  const { t } = useTranslation();
  const { isLoading, error, enrollments, isValidating } = useEnrollmentHistory(patientUuid);
  const switcherHeaders = sortBy(Object.keys(enrollments || {}));
  const [switchItem, setSwitcherItem] = useState<SwitchEventHandlersParams>({ index: 0 });
  const patientEnrollments = useMemo(
    () => (isLoading ? [] : enrollments[switchItem?.name || first(switcherHeaders)]),
    [enrollments, isLoading, switchItem?.name, switcherHeaders],
  );

  if (isLoading) {
    return (
      <div className={styles.widgetCard}>
        <StructuredListSkeleton />
      </div>
    );
  }

  if (error) {
    return <ErrorState error={error} headerTitle={t('carePanelError', 'Care panel')} />;
  }

  if (Object.keys(enrollments).length === 0) {
    return (
      <>
        <EmptyState displayText={t('carePanel', 'care panel')} headerTitle={t('carePanel', 'Care panel')} />
      </>
    );
  }

  return (
    <div className={styles.widgetCard}>
      <CardHeader title={t('carePanel', 'Care Panel')}>
        <div className={styles.contextSwitcherContainer}>
          <ContentSwitcher size="md" selectedIndex={switchItem?.index} onChange={(params) => setSwitcherItem(params)}>
            {switcherHeaders?.map((enrollment) => (
              <Switch key={enrollment} name={enrollment} text={enrollment} />
            ))}
          </ContentSwitcher>
        </div>
      </CardHeader>
      <div style={{ width: '100%', minHeight: '20rem' }}>
        <ProgramSummary patientUuid={patientUuid} programName={switcherHeaders[switchItem?.index]} />
        <RegimenHistory patientUuid={patientUuid} category={switcherHeaders[switchItem?.index]} />
        <ProgramEnrollment
          patientUuid={patientUuid}
          programName={switcherHeaders[switchItem?.index]}
          enrollments={patientEnrollments}
          formEntrySub={formEntrySub}
        />
      </div>
    </div>
  );
};

export default CarePanel;
