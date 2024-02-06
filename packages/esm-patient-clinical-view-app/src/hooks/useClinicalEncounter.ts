import useSWR from 'swr';
import { OpenmrsEncounter } from '../types';
import { openmrsFetch, useConfig } from '@openmrs/esm-framework';
import { ConfigObject } from '../config-schema';
import { clinicalEncounterRepresentation, ClinicalEncounterFormUuid } from '../utils/constants';
import sortBy from 'lodash/sortBy';
export function useClinicalEncounter(patientUuid: string, encounterType: string) {
  const config = useConfig() as ConfigObject;
  const url = `/ws/rest/v1/encounter?encounterType=${config.clinicalEncounterUuid}&patient=${patientUuid}&v=${clinicalEncounterRepresentation}`;

  const { data, error, isLoading, isValidating, mutate } = useSWR<{ data: { results: OpenmrsEncounter[] } }, Error>(
    url,
    openmrsFetch,
  );
  const clinicalEncounter = data?.data?.results?.filter((enc) => enc.form.uuid === ClinicalEncounterFormUuid);
  const sortedClinicalEncounter = sortBy(clinicalEncounter, 'encounterDatetime').reverse();
  return {
    encounters: sortedClinicalEncounter,
    isLoading,
    isValidating,
    error,
    mutate,
  };
}