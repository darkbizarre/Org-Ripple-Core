/*
 *  Copyright 2015 Ripple OSI
 *
 *      Licensed under the Apache License, Version 2.0 (the "License");
 *      you may not use this file except in compliance with the License.
 *      You may obtain a copy of the License at
 *
 *          http://www.apache.org/licenses/LICENSE-2.0
 *
 *      Unless required by applicable law or agreed to in writing, software
 *      distributed under the License is distributed on an "AS IS" BASIS,
 *      WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 *      See the License for the specific language governing permissions and
 *      limitations under the License.
 *
 */
package org.rippleosi.patient.medication.search;

import org.rippleosi.common.exception.DataNotFoundException;
import org.rippleosi.common.service.AbstractEtherCISQueryStrategy;
import org.rippleosi.patient.medication.model.MedicationDetails;

import java.util.List;
import java.util.Map;

public class EtherCISMedicationDetailsQueryStrategy extends AbstractEtherCISQueryStrategy<MedicationDetails> {

    private final String medicationId;

    EtherCISMedicationDetailsQueryStrategy(String patientId, String medicationId) {
        super(patientId);
        this.medicationId = medicationId;
    }

    @Override
    public String getQuery(String namespace, String ehrId) {
        return "SELECT ehr.entry.composition_id as uid, " +
                "ehr.party_identified.name as author, " +
                "ehr.event_context.start_time as date_created, " +
                "ehr.entry.entry #>> " +
                    "'{" +
                        "/composition[openEHR-EHR-COMPOSITION.medication_list.v0 and name/value=''Current medication list''], " +
                        "/content[openEHR-EHR-SECTION.medication_medical_devices_rcp.v1],0, " +
                        "/items[openEHR-EHR-SECTION.current_medication_rcp.v1],0,/items[openEHR-EHR-INSTRUCTION.medication_order.v0],0,/activities[at0001 and name/value=''Order''], /description[at0002],/items[at0109 and name/value=''Dose amount description''],/value,value " +
                    "}' as dose_amount, " +
                "ehr.entry.entry #>> " +
                    "'{" +
                        "/composition[openEHR-EHR-COMPOSITION.medication_list.v0 and name/value=''Current medication list''], " +
                        "/content[openEHR-EHR-SECTION.medication_medical_devices_rcp.v1],0, " +
                        "/items[openEHR-EHR-SECTION.current_medication_rcp.v1],0,/items[openEHR-EHR-INSTRUCTION.medication_order.v0],0,/narrative,/value,value" +
                        "}' as narrative, " +
                "ehr.entry.entry #>> " +
                    "'{" +
                        "/composition[openEHR-EHR-COMPOSITION.medication_list.v0 and name/value=''Current medication list''], " +
                        "/content[openEHR-EHR-SECTION.medication_medical_devices_rcp.v1],0, " +
                        "/items[openEHR-EHR-SECTION.current_medication_rcp.v1],0,/items[openEHR-EHR-INSTRUCTION.medication_order.v0],0,/activities[at0001 and name/value=''Order''], /description[at0002],/items[at0091 and name/value=''Route''],/value,value " +
                    "}' as route, " +
                "ehr.entry.entry #>> " +
                    "'{" +
                        "/composition[openEHR-EHR-COMPOSITION.medication_list.v0 and name/value=''Current medication list''], " +
                        "/content[openEHR-EHR-SECTION.medication_medical_devices_rcp.v1],0, " +
                        "/items[openEHR-EHR-SECTION.current_medication_rcp.v1],0,/items[openEHR-EHR-INSTRUCTION.medication_order.v0],0,/activities[at0001 and name/value=''Order''], /description[at0002],/items[at0070 and name/value=''Medication item''],/value,value " +
                    "}' as name, " +
                "ehr.entry.entry #>> " +
                    "'{" +
                        "/composition[openEHR-EHR-COMPOSITION.medication_list.v0 and name/value=''Current medication list''], " +
                        "/content[openEHR-EHR-SECTION.medication_medical_devices_rcp.v1],0, " +
                        "/items[openEHR-EHR-SECTION.current_medication_rcp.v1],0,/items[openEHR-EHR-INSTRUCTION.medication_order.v0],0,/activities[at0001 and name/value=''Order''], /description[at0002],/items[at0070 and name/value=''Medication item''],/value,definingCode,codeString " +
                    "}' as medication_code, " +
                "ehr.entry.entry #>> " +
                "'{" +
                        "/composition[openEHR-EHR-COMPOSITION.medication_list.v0 and name/value=''Current medication list''], " +
                        "/content[openEHR-EHR-SECTION.medication_medical_devices_rcp.v1],0, " +
                        "/items[openEHR-EHR-SECTION.current_medication_rcp.v1],0,/items[openEHR-EHR-INSTRUCTION.medication_order.v0],0,/activities[at0001 and name/value=''Order''], /description[at0002],/items[at0070 and name/value=''Medication item''],/value,definingCode,terminologyId,value " +
                    "}' as medication_terminology, " +
                "ehr.entry.entry #>> " +
                    "'{" +
                        "/composition[openEHR-EHR-COMPOSITION.medication_list.v0 and name/value=''Current medication list''], " +
                        "/content[openEHR-EHR-SECTION.medication_medical_devices_rcp.v1],0, " +
                        "/items[openEHR-EHR-SECTION.current_medication_rcp.v1],0,/items[openEHR-EHR-INSTRUCTION.medication_order.v0],0,/activities[at0001 and name/value=''Order''], /description[at0002],/items[at0113 and name/value=''Course details''],/items[at0012],0,/value,/value,value " +
                    "}' as start_date, " +
                "ehr.entry.entry #>> " +
                    "'{" +
                        "/composition[openEHR-EHR-COMPOSITION.medication_list.v0 and name/value=''Current medication list''], " +
                        "/content[openEHR-EHR-SECTION.medication_medical_devices_rcp.v1],0, " +
                        "/items[openEHR-EHR-SECTION.current_medication_rcp.v1],0,/items[openEHR-EHR-INSTRUCTION.medication_order.v0],0,/activities[at0001 and name/value=''Order''], /description[at0002],/items[at0055 and name/value=''Dose timing description''],/value, value " +
                    "}' as dose_timing, " +
                "ehr.entry.entry #>> " +
                     "'{" +
                          "/composition[openEHR-EHR-COMPOSITION.medication_list.v0 and name/value=''Current medication list''], " +
                          "/content[openEHR-EHR-SECTION.medication_medical_devices_rcp.v1],0, " +
                          "/items[openEHR-EHR-SECTION.current_medication_rcp.v1],0,/items[openEHR-EHR-INSTRUCTION.medication_order.v0],0,/activities[at0001 and name/value=''Order''], /description[at0002],/items[at0044 and name/value=''Additional instruction''],/value, value " +
                     "}' as dose_directions " +
                "FROM ehr.entry " +
                "INNER JOIN ehr.composition ON ehr.composition.id=ehr.entry.composition_id " +
                "INNER JOIN ehr.event_context ON ehr.event_context.composition_id=ehr.entry.composition_id " +
                "INNER JOIN ehr.party_identified ON ehr.composition.composer=ehr.party_identified.id " +
                "WHERE (ehr.composition.ehr_id = '" + ehrId + "') " +
                "AND (ehr.entry.archetype_Id = 'openEHR-EHR-COMPOSITION.medication_list.v0') " +
                "AND ehr.entry.composition_id = '" + medicationId + "';";
    }

    @Override
    public MedicationDetails transform(List<Map<String, Object>> resultSet) {

        if (resultSet.isEmpty()) {
            throw new DataNotFoundException("No results found");
        }

        Map<String, Object> data = resultSet.get(0);

        return new EtherCISMedicationDetailsTransformer().transform(data);
    }
}
