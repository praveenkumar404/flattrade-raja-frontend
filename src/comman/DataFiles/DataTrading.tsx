export function getData() {
    const data = [
      {
        date: new Date("2022-03-01"),
        open: 140.039993,
        high: 140.479996,
        low: 133.580002,
        close: 136.449997,
        volume: 36840400,
      },
      {
        date: new Date("2022-03-02"),
        open: 137.289993,
        high: 140.039993,
        low: 136.610001,
        close: 139.279999,
        volume: 19405600,
      },
      {
        date: new Date("2022-03-03"),
        open: 139.839996,
        high: 140.979996,
        low: 137.059998,
        close: 138.289993,
        volume: 16640800,
      },
      {
        date: new Date("2022-03-04"),
        open: 134.940002,
        high: 135.419998,
        low: 132.399994,
        close: 134.399994,
        volume: 21016000,
      },
      {
        date: new Date("2022-03-07"),
        open: 132.169998,
        high: 132.690002,
        low: 128.949997,
        close: 129.210007,
        volume: 27560100,
      },
      {
        date: new Date("2022-03-08"),
        open: 129.639999,
        high: 131.789993,
        low: 127.269997,
        close: 128.300003,
        volume: 19207800,
      },
      {
        date: new Date("2022-03-09"),
        open: 132.899994,
        high: 135.240005,
        low: 132.440002,
        close: 133.440002,
        volume: 17536200,
      },
      {
        date: new Date("2022-03-10"),
        open: 131.860001,
        high: 133.449997,
        low: 130.320007,
        close: 131.860001,
        volume: 15604200,
      },
      {
        date: new Date("2022-03-11"),
        open: 132.490005,
        high: 134.080002,
        low: 128.419998,
        close: 128.889999,
        volume: 20061800,
      },
      {
        date: new Date("2022-03-14"),
        open: 129.460007,
        high: 132.919998,
        low: 129.229996,
        close: 130.169998,
        volume: 15786900,
      },
      {
        date: new Date("2022-03-15"),
        open: 131.800003,
        high: 133.550003,
        low: 131.130005,
        close: 132.479996,
        volume: 15096600,
      },
      {
        date: new Date("2022-03-16"),
        open: 134.869995,
        high: 138.490005,
        low: 134.429993,
        close: 138.399994,
        volume: 20354900,
      },
      {
        date: new Date("2022-03-17"),
        open: 136.860001,
        high: 140.190002,
        low: 135.919998,
        close: 140.149994,
        volume: 17050500,
      },
      {
        date: new Date("2022-03-18"),
        open: 140.190002,
        high: 140.850006,
        low: 138.460007,
        close: 140.100006,
        volume: 23656500,
      },
      {
        date: new Date("2022-03-21"),
        open: 140.350006,
        high: 140.759995,
        low: 138.729996,
        close: 139.649994,
        volume: 12676100,
      },
      {
        date: new Date("2022-03-22"),
        open: 142.270004,
        high: 143.929993,
        low: 141.720001,
        close: 142.619995,
        volume: 13548600,
      },
      {
        date: new Date("2022-03-23"),
        open: 140.979996,
        high: 141.589996,
        low: 139.199997,
        close: 139.779999,
        volume: 12093200,
      },
      {
        date: new Date("2022-03-24"),
        open: 140.300003,
        high: 140.710007,
        low: 139.110001,
        close: 140.690002,
        volume: 10017600,
      },
      {
        date: new Date("2022-03-25"),
        open: 141.089996,
        high: 143.179993,
        low: 140.800003,
        close: 141.919998,
        volume: 8383500,
      },
      {
        date: new Date("2022-03-28"),
        open: 140,
        high: 140.970001,
        low: 137.899994,
        close: 140.869995,
        volume: 10818100,
      },
      {
        date: new Date("2022-03-29"),
        open: 143.350006,
        high: 143.600006,
        low: 140.240005,
        close: 141.179993,
        volume: 11316500,
      },
      {
        date: new Date("2022-03-30"),
        open: 141.899994,
        high: 142.119995,
        low: 139.910004,
        close: 140.539993,
        volume: 8771000,
      },
      {
        date: new Date("2022-03-31"),
        open: 139.830002,
        high: 140.350006,
        low: 136.259995,
        close: 136.320007,
        volume: 17353900,
      },
      {
        date: new Date("2022-04-01"),
        open: 137.399994,
        high: 137.410004,
        low: 133.800003,
        close: 135.309998,
        volume: 15721300,
      },
      {
        date: new Date("2022-04-04"),
        open: 134.119995,
        high: 136.940002,
        low: 132.889999,
        close: 135.910004,
        volume: 17416400,
      },
      {
        date: new Date("2022-04-05"),
        open: 134.070007,
        high: 135.399994,
        low: 133.009995,
        close: 133.339996,
        volume: 12110300,
      },
      {
        date: new Date("2022-04-06"),
        open: 131.580002,
        high: 132.559998,
        low: 130.960007,
        close: 131.490005,
        volume: 12914700,
      },
      {
        date: new Date("2022-04-07"),
        open: 130.949997,
        high: 131.919998,
        low: 128.729996,
        close: 131.089996,
        volume: 12994200,
      },
      {
        date: new Date("2022-04-08"),
        open: 131.669998,
        high: 133.899994,
        low: 131.490005,
        close: 133.490005,
        volume: 13126900,
      },
      {
        date: new Date("2022-04-11"),
        open: 133,
        high: 134.899994,
        low: 132.570007,
        close: 133,
        volume: 10466400,
      },
      {
        date: new Date("2022-04-12"),
        open: 132.139999,
        high: 134.580002,
        low: 130.699997,
        close: 131.539993,
        volume: 12989900,
      },
      {
        date: new Date("2022-04-13"),
        open: 126.940002,
        high: 129.25,
        low: 126.010002,
        close: 127.300003,
        volume: 30838000,
      },
      {
        date: new Date("2022-04-14"),
        open: 126.5,
        high: 128.300003,
        low: 125.019997,
        close: 126.120003,
        volume: 18835200,
      },
      {
        date: new Date("2022-04-18"),
        open: 125.669998,
        high: 129.240005,
        low: 125.540001,
        close: 128.460007,
        volume: 11834400,
      },
      {
        date: new Date("2022-04-19"),
        open: 128.449997,
        high: 131.320007,
        low: 128.229996,
        close: 131.119995,
        volume: 15015400,
      },
      {
        date: new Date("2022-04-20"),
        open: 132.520004,
        high: 133.509995,
        low: 131.339996,
        close: 131.580002,
        volume: 13430200,
      },
      {
        date: new Date("2022-04-21"),
        open: 132.220001,
        high: 132.809998,
        low: 129.960007,
        close: 130.559998,
        volume: 12174200,
      },
      {
        date: new Date("2022-04-22"),
        open: 130.279999,
        high: 130.520004,
        low: 126.690002,
        close: 126.809998,
        volume: 14318800,
      },
      {
        date: new Date("2022-04-25"),
        open: 126.010002,
        high: 127.120003,
        low: 123.110001,
        close: 126.769997,
        volume: 17149000,
      },
      {
        date: new Date("2022-04-26"),
        open: 124.639999,
        high: 126.410004,
        low: 122.870003,
        close: 123.019997,
        volume: 17209500,
      },
      {
        date: new Date("2022-04-27"),
        open: 122.330002,
        high: 123.559998,
        low: 121.220001,
        close: 121.419998,
        volume: 17215200,
      },
      {
        date: new Date("2022-04-28"),
        open: 122.809998,
        high: 123.650002,
        low: 121.139999,
        close: 123.339996,
        volume: 13015600,
      },
      {
        date: new Date("2022-04-29"),
        open: 123.050003,
        high: 123.610001,
        low: 118.900002,
        close: 119.360001,
        volume: 14874800,
      },
      {
        date: new Date("2022-05-02"),
        open: 119.879997,
        high: 120.709999,
        low: 118.220001,
        close: 120.449997,
        volume: 18545000,
      },
      {
        date: new Date("2022-05-03"),
        open: 121.529999,
        high: 124.169998,
        low: 120.779999,
        close: 123.029999,
        volume: 15720900,
      },
      {
        date: new Date("2022-05-04"),
        open: 122.800003,
        high: 127.400002,
        low: 122.739998,
        close: 127.099998,
        volume: 17128500,
      },
      {
        date: new Date("2022-05-05"),
        open: 125.25,
        high: 126.099998,
        low: 122.160004,
        close: 123.919998,
        volume: 15055400,
      },
      {
        date: new Date("2022-05-06"),
        open: 123.800003,
        high: 124.290001,
        low: 121.18,
        close: 123.720001,
        volume: 14417900,
      },
      {
        date: new Date("2022-05-09"),
        open: 122.110001,
        high: 123.330002,
        low: 120.5,
        close: 121.860001,
        volume: 14312300,
      },
      {
        date: new Date("2022-05-10"),
        open: 123.110001,
        high: 123.779999,
        low: 117.559998,
        close: 118.889999,
        volume: 16382400,
      }
    ]
    return data;
}