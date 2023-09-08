import React, { useRef, useState } from "react"
import styles from './shr-summary.scss';
import { useTranslation } from 'react-i18next';
import { useLayoutType, useSession } from '@openmrs/esm-framework';
import { StructuredListSkeleton, Button } from '@carbon/react';
import { useSHRSummary } from '../hooks/useSHRSummary';
import { Printer } from '@carbon/react/icons';
import { useReactToPrint } from 'react-to-print';
import PrintComponent from '../print-layout/print.component';
import {
    DataTable,
    Table,
    TableHead,
    TableRow,
    TableHeader,
    TableBody,
    TableCell,
  } from '@carbon/react';

interface SHRSummaryProps {
    patientUuid: string;
}

const SharedHealthRecordsSummary: React.FC<SHRSummaryProps> = ({ patientUuid }) => {

    const { data, isError, isLoading } = useSHRSummary(patientUuid);
    const currentUserSession = useSession();
    const componentRef = useRef(null);
    const [printMode, setPrintMode] = useState(false);

    const { t } = useTranslation();
    const isTablet = useLayoutType() == 'tablet';

    const printRef = useReactToPrint({
        content: () => componentRef.current,
        onBeforeGetContent: () => setPrintMode(true),
        onAfterPrint: () => setPrintMode(false),
        pageStyle: styles.pageStyle,
        documentTitle: "Shared Health Records",
    });

    const delay = (ms) => new Promise((resolve) => setTimeout(resolve, ms));
    const handlePrint = async () => {
        await delay(500);
        printRef();
    };

    // If still loading
    if (isLoading) {
        return <StructuredListSkeleton role="progressbar" />;
    }

    // If there is an error
    if (isError) {
        return <span>{t('errorSHRSummary', 'Error loading SHR summary')}</span>;
    }

    // If there is no data
    if (Object.keys(data)?.length === 0) {
        return;
    }

    const tableHeaders = [
        {
          key: 'name',
          header: t('name', 'Name'),
        },
        {
          key: 'value',
          header: t('value', 'Value'),
        },
        {
          key: 'dateRecorded',
          header: t('daterecorded', 'Date Recorded'),
        },
    ];

    const headers = ['Name', 'Value', 'Date Recorded'];

    if (Object.keys(data).length > 0) {
        return (
            <div className={styles.bodyContainer} ref={componentRef}>
                {printMode === true && <PrintComponent />}
                
                <div className={styles.card}>
                
                    <div className={isTablet ? styles.tabletHeading : styles.desktopHeading}>
                        <h4 className={styles.title}> {t('shrVitals', 'VITALS')}</h4>
                        {printMode === false && (
                        <Button
                            size="sm"
                            className={styles.btnShow}
                            onClick={() => {
                            handlePrint(), setPrintMode(true);
                            }}
                            kind="tertiary"
                            renderIcon={(props) => <Printer size={16} {...props} />}
                            iconDescription={t('print', 'Print')}>
                            {t('print', 'Print')}
                        </Button>
                        )}
                    </div>

                    <hr />

                    {Array.isArray(data?.vitals) && data?.vitals.length > 0 ? (
                        data?.vitals.map((item, index) => (
                            <div className={styles.container}>
                                <div className={styles.content}>
                                    <p className={styles.label}>{t('vitalsName', 'Name')}</p>
                                    <p>
                                        <span className={styles.value}>{item?.name ? item?.name : '--'}</span>
                                    </p>
                                </div>
                                <div className={styles.content}>
                                    <p className={styles.label}>{t('vitalsValue', 'Value')}</p>
                                    <p>
                                        <span className={styles.value}>{item?.value ? item?.value : '--'}</span>
                                    </p>
                                </div>
                                <div className={styles.content}>
                                    <p className={styles.label}>{t('vitalsDateRecorded', 'Date Recorded')}</p>
                                    <p>
                                        <span className={styles.value}>{item?.dateRecorded ? item?.dateRecorded : '--'}</span>
                                    </p>
                                </div>
                                <div className={styles.content}>
                                    <p className={styles.label}>{t('vitalsUuid', 'UUID')}</p>
                                    <p>
                                        <span className={styles.value}>{item?.uuid ? item?.uuid : '--'}</span>
                                    </p>
                                </div>
                            </div>
                            ))
                        ) : (
                        <h4 className={styles.title}> {t('noSHRVitals', 'No SHR Vitals')}</h4>
                    )}

                    <hr />

                    <div className={isTablet ? styles.tabletHeading : styles.desktopHeading}>
                        <h4 className={styles.title}> {t('shrLabResults', 'Lab Results')}</h4>
                    </div>

                    <hr />

                    {Array.isArray(data?.labResults) && data?.labResults.length > 0 ? (
                        data?.labResults.map((item, index) => (
                            <div className={styles.container}>
                                <div className={styles.content}>
                                    <p className={styles.label}>{t('labResultsName', 'Name')}</p>
                                    <p>
                                        <span className={styles.value}>{item?.name ? item?.name : '--'}</span>
                                    </p>
                                </div>
                                <div className={styles.content}>
                                    <p className={styles.label}>{t('labResultsValue', 'Value')}</p>
                                    <p>
                                        <span className={styles.value}>{item?.value ? item?.value : '--'}</span>
                                    </p>
                                </div>
                                <div className={styles.content}>
                                    <p className={styles.label}>{t('labResultsDateRecorded', 'Date Recorded')}</p>
                                    <p>
                                        <span className={styles.value}>{item?.dateRecorded ? item?.dateRecorded : '--'}</span>
                                    </p>
                                </div>
                                <div className={styles.content}>
                                    <p className={styles.label}>{t('labResultsUuid', 'UUID')}</p>
                                    <p>
                                        <span className={styles.value}>{item?.uuid ? item?.uuid : '--'}</span>
                                    </p>
                                </div>
                            </div>
                            ))
                        ) : (
                        <h4 className={styles.title}> {t('noLabResults', 'No Lab Results')}</h4>
                    )}

                    <hr />
                    
                    <div className={isTablet ? styles.tabletHeading : styles.desktopHeading}>
                        <h4 className={styles.title}> {t('shrComplaints', 'Complaints')}</h4>
                    </div>

                    <hr />

                    {Array.isArray(data?.complaints) && data?.complaints.length > 0 ? (
                        data?.complaints.map((item, index) => (
                            <div className={styles.container}>
                                <div className={styles.content}>
                                    <p className={styles.label}>{t('complaintsName', 'Name')}</p>
                                    <p>
                                        <span className={styles.value}>{item?.name ? item?.name : '--'}</span>
                                    </p>
                                </div>
                                <div className={styles.content}>
                                    <p className={styles.label}>{t('complaintsValue', 'Value')}</p>
                                    <p>
                                        <span className={styles.value}>{item?.value ? item?.value : '--'}</span>
                                    </p>
                                </div>
                                <div className={styles.content}>
                                    <p className={styles.label}>{t('complaintsDateRecorded', 'Date Recorded')}</p>
                                    <p>
                                        <span className={styles.value}>{item?.dateRecorded ? item?.dateRecorded : '--'}</span>
                                    </p>
                                </div>
                                <div className={styles.content}>
                                    <p className={styles.label}>{t('complaintsUuid', 'UUID')}</p>
                                    <p>
                                        <span className={styles.value}>{item?.uuid ? item?.uuid : '--'}</span>
                                    </p>
                                </div>
                            </div>
                            ))
                        ) : (
                        <h4 className={styles.title}> {t('noComplaints', 'No Complaints')}</h4>
                    )}

                    <hr />

                    
                
                </div>
                
            </div>
        );
    } else {
        return (
            <div>
                <h4 className={styles.title}> {t('noSharedHealthRecordsFound', 'No Shared Health Records Found')}</h4>
            </div>
        );
    }
}

export default SharedHealthRecordsSummary