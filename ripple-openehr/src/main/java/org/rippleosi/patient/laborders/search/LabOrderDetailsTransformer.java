/*
 * Copyright 2015 Ripple OSI
 *
 *    Licensed under the Apache License, Version 2.0 (the "License");
 *    you may not use this file except in compliance with the License.
 *    You may obtain a copy of the License at
 *
 *        http://www.apache.org/licenses/LICENSE-2.0
 *
 *    Unless required by applicable law or agreed to in writing, software
 *    distributed under the License is distributed on an "AS IS" BASIS,
 *    WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 *    See the License for the specific language governing permissions and
 *    limitations under the License.
 */
package org.rippleosi.patient.laborders.search;

import java.util.Date;
import java.util.Map;

import org.apache.commons.collections4.MapUtils;
import org.apache.commons.collections4.Transformer;
import org.rippleosi.common.util.DateFormatter;
import org.rippleosi.patient.laborders.model.LabOrderDetails;

/**
 */
public class LabOrderDetailsTransformer implements Transformer<Map<String, Object>, LabOrderDetails> {

    @Override
    public LabOrderDetails transform(Map<String, Object> input) {

        Date orderDate = DateFormatter.toDate(MapUtils.getString(input, "order_date"));
        Date dateCreated = DateFormatter.toDate(MapUtils.getString(input, "date_created"));

        LabOrderDetails labOrder = new LabOrderDetails();
        labOrder.setSource("Marand");
        labOrder.setSourceId(MapUtils.getString(input, "uid"));
        labOrder.setName(MapUtils.getString(input, "name"));
        labOrder.setOrderDate(orderDate);
        labOrder.setAuthor(MapUtils.getString(input, "author"));
        labOrder.setDateCreated(dateCreated);
        labOrder.setCode(MapUtils.getString(input, "code"));
        labOrder.setTerminology(MapUtils.getString(input, "terminology"));

        return labOrder;
    }
}
