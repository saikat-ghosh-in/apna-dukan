package com.mercato.Controller;

import com.mercato.Service.FulfillmentService;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api")
@RequiredArgsConstructor
public class SellerController {

    private final FulfillmentService fulfillmentService;


}
