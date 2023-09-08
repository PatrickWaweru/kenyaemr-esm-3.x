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
                        <h4 className={styles.title}> {t('shrVitals', 'Vitals')}</h4>
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

                    <DataTable rows={data?.vitals} headers={headers}>
                        {({ rows, headers, getHeaderProps, getRowProps }) => (
                            <Table>
                            <TableHead>
                                <TableRow>
                                {headers.map((header) => (
                                    <TableHeader {...getHeaderProps({ header })}>{header}</TableHeader>
                                ))}
                                </TableRow>
                            </TableHead>
                            <TableBody>
                                {data?.vitals.map((row) => (
                                <TableRow {...getRowProps({ row })}>
                                    <TableCell>{row?.name}</TableCell>
                                    <TableCell>{row?.value}</TableCell>
                                    <TableCell>{row?.dateRecorded}</TableCell>
                                </TableRow>
                                ))}
                            </TableBody>
                            </Table>
                        )}
                    </DataTable>

                    <hr />

                    <div className={isTablet ? styles.tabletHeading : styles.desktopHeading}>
                        <h4 className={styles.title}> {t('shrLabResults', 'Lab Results')}</h4>
                    </div>

                    <hr />

                    <DataTable rows={data?.labResults} headers={headers}>
                        {({ rows, headers, getHeaderProps, getRowProps }) => (
                            <Table>
                            <TableHead>
                                <TableRow>
                                {headers.map((header) => (
                                    <TableHeader {...getHeaderProps({ header })}>{header}</TableHeader>
                                ))}
                                </TableRow>
                            </TableHead>
                            <TableBody>
                                {data?.labResults.map((row) => (
                                <TableRow {...getRowProps({ row })}>
                                    <TableCell>{row?.name}</TableCell>
                                    <TableCell>{row?.value}</TableCell>
                                    <TableCell>{row?.dateRecorded}</TableCell>
                                </TableRow>
                                ))}
                            </TableBody>
                            </Table>
                        )}
                    </DataTable>

                    <hr />
                    
                    <div className={isTablet ? styles.tabletHeading : styles.desktopHeading}>
                        <h4 className={styles.title}> {t('shrComplaints', 'Complaints')}</h4>
                    </div>

                    <hr />

                    <DataTable rows={data?.complaints} headers={headers}>
                        {({ rows, headers, getHeaderProps, getRowProps }) => (
                            <Table>
                            <TableHead>
                                <TableRow>
                                {headers.map((header) => (
                                    <TableHeader {...getHeaderProps({ header })}>{header}</TableHeader>
                                ))}
                                </TableRow>
                            </TableHead>
                            <TableBody>
                                {data?.complaints.map((row) => (
                                <TableRow {...getRowProps({ row })}>
                                    <TableCell>{row?.name}</TableCell>
                                    <TableCell>{row?.value}</TableCell>
                                    <TableCell>{row?.dateRecorded}</TableCell>
                                </TableRow>
                                ))}
                            </TableBody>
                            </Table>
                        )}
                    </DataTable>

                    <hr />

                    <div className={isTablet ? styles.tabletHeading : styles.desktopHeading}>
                        <h4 className={styles.title}> {t('shrDiagnosis', 'Diagnosis')}</h4>
                    </div>

                    <hr />

                    <DataTable rows={data?.diagnosis} headers={headers}>
                        {({ rows, headers, getHeaderProps, getRowProps }) => (
                            <Table>
                            <TableHead>
                                <TableRow>
                                {headers.map((header) => (
                                    <TableHeader {...getHeaderProps({ header })}>{header}</TableHeader>
                                ))}
                                </TableRow>
                            </TableHead>
                            <TableBody>
                                {data?.diagnosis.map((row) => (
                                <TableRow {...getRowProps({ row })}>
                                    <TableCell>{row?.name}</TableCell>
                                    <TableCell>{row?.value}</TableCell>
                                    <TableCell>{row?.dateRecorded}</TableCell>
                                </TableRow>
                                ))}
                            </TableBody>
                            </Table>
                        )}
                    </DataTable>

                    <hr />

                    <div className={isTablet ? styles.tabletHeading : styles.desktopHeading}>
                        <h4 className={styles.title}> {t('shrAllergies', 'Allergies')}</h4>
                    </div>

                    <hr />

                    <DataTable rows={data?.allergies} headers={headers}>
                        {({ rows, headers, getHeaderProps, getRowProps }) => (
                            <Table>
                            <TableHead>
                                <TableRow>
                                {headers.map((header) => (
                                    <TableHeader {...getHeaderProps({ header })}>{header}</TableHeader>
                                ))}
                                </TableRow>
                            </TableHead>
                            <TableBody>
                                {data?.allergies.map((row) => (
                                <TableRow {...getRowProps({ row })}>
                                    <TableCell>{row?.name}</TableCell>
                                    <TableCell>{row?.value}</TableCell>
                                    <TableCell>{row?.dateRecorded}</TableCell>
                                </TableRow>
                                ))}
                            </TableBody>
                            </Table>
                        )}
                    </DataTable>

                    <hr />

                    <div className={isTablet ? styles.tabletHeading : styles.desktopHeading}>
                        <h4 className={styles.title}> {t('shrConditions', 'Conditions')}</h4>
                    </div>

                    <hr />

                    <DataTable rows={data?.conditions} headers={headers}>
                        {({ rows, headers, getHeaderProps, getRowProps }) => (
                            <Table>
                            <TableHead>
                                <TableRow>
                                {headers.map((header) => (
                                    <TableHeader {...getHeaderProps({ header })}>{header}</TableHeader>
                                ))}
                                </TableRow>
                            </TableHead>
                            <TableBody>
                                {data?.conditions.map((row) => (
                                <TableRow {...getRowProps({ row })}>
                                    <TableCell>{row?.name}</TableCell>
                                    <TableCell>{row?.value}</TableCell>
                                    <TableCell>{row?.dateRecorded}</TableCell>
                                </TableRow>
                                ))}
                            </TableBody>
                            </Table>
                        )}
                    </DataTable>

                    <hr />

                    <div className={isTablet ? styles.tabletHeading : styles.desktopHeading}>
                        <h4 className={styles.title}> {t('shrMedications', 'Medications')}</h4>
                    </div>

                    <hr />

                    <DataTable rows={data?.medications} headers={headers}>
                        {({ rows, headers, getHeaderProps, getRowProps }) => (
                            <Table>
                            <TableHead>
                                <TableRow>
                                {headers.map((header) => (
                                    <TableHeader {...getHeaderProps({ header })}>{header}</TableHeader>
                                ))}
                                </TableRow>
                            </TableHead>
                            <TableBody>
                                {data?.medications.map((row) => (
                                <TableRow {...getRowProps({ row })}>
                                    <TableCell>{row?.name}</TableCell>
                                    <TableCell>{row?.value}</TableCell>
                                    <TableCell>{row?.dateRecorded}</TableCell>
                                </TableRow>
                                ))}
                            </TableBody>
                            </Table>
                        )}
                    </DataTable>

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