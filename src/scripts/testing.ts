import { Span } from './model';

export const example_threads = [
    {
        "id": 140736286213056,
        "name": "main",
        "spans": [
            {
                "name": "scene",
                "start_ns": 3246183,
                "end_ns": 2086037490,
                "delta": 2082791307,
                "depth": 0,
                "children": [
                    {
                        "name": "evaluate GroupId(0)",
                        "start_ns": 30601590,
                        "end_ns": 363378114,
                        "delta": 332776524,
                        "depth": 1,
                        "children": [
                            {
                                "name": "eval_basic_group",
                                "start_ns": 30625855,
                                "end_ns": 363062078,
                                "delta": 332436223,
                                "depth": 2,
                                "children": [
                                    {
                                        "name": "OpenClContext::field_buffer",
                                        "start_ns": 32131522,
                                        "end_ns": 32983305,
                                        "delta": 851783,
                                        "depth": 3,
                                        "children": [],
                                        "notes": []
                                    },
                                    {
                                        "name": "OpenClContext::compile",
                                        "start_ns": 32993941,
                                        "end_ns": 345721420,
                                        "delta": 312727479,
                                        "depth": 3,
                                        "children": [],
                                        "notes": []
                                    },
                                    {
                                        "name": "eval",
                                        "start_ns": 345738257,
                                        "end_ns": 345753476,
                                        "delta": 15219,
                                        "depth": 3,
                                        "children": [],
                                        "notes": []
                                    },
                                    {
                                        "name": "telemetry intermediate_eval_basic",
                                        "start_ns": 345754587,
                                        "end_ns": 362997718,
                                        "delta": 17243131,
                                        "depth": 3,
                                        "children": [
                                            {
                                                "name": "save_field_buffer",
                                                "start_ns": 345780848,
                                                "end_ns": 352900655,
                                                "delta": 7119807,
                                                "depth": 4,
                                                "children": [
                                                    {
                                                        "name": "fetch values",
                                                        "start_ns": 345782090,
                                                        "end_ns": 346258300,
                                                        "delta": 476210,
                                                        "depth": 5,
                                                        "children": [],
                                                        "notes": []
                                                    },
                                                    {
                                                        "name": "save_image",
                                                        "start_ns": 346259521,
                                                        "end_ns": 352897141,
                                                        "delta": 6637620,
                                                        "depth": 5,
                                                        "children": [],
                                                        "notes": []
                                                    }
                                                ],
                                                "notes": []
                                            }
                                        ],
                                        "notes": []
                                    }
                                ],
                                "notes": []
                            }
                        ],
                        "notes": []
                    },
                    {
                        "name": "opencl marching [run_marching]",
                        "start_ns": 363382169,
                        "end_ns": 439723502,
                        "delta": 76341333,
                        "depth": 1,
                        "children": [
                            {
                                "name": "OpenClContext::compile",
                                "start_ns": 363393833,
                                "end_ns": 436953739,
                                "delta": 73559906,
                                "depth": 2,
                                "children": [],
                                "notes": []
                            },
                            {
                                "name": "OpenClContext::linear_buffer",
                                "start_ns": 439572304,
                                "end_ns": 439670512,
                                "delta": 98208,
                                "depth": 2,
                                "children": [],
                                "notes": []
                            },
                            {
                                "name": "OpenClContext::sync_buffer",
                                "start_ns": 439671605,
                                "end_ns": 439688504,
                                "delta": 16899,
                                "depth": 2,
                                "children": [],
                                "notes": []
                            }
                        ],
                        "notes": []
                    },
                    {
                        "name": "connect_lines",
                        "start_ns": 442502384,
                        "end_ns": 2050373046,
                        "delta": 1607870662,
                        "depth": 1,
                        "children": [
                            {
                                "name": "join_lines",
                                "start_ns": 446360689,
                                "end_ns": 2049050062,
                                "delta": 1602689373,
                                "depth": 2,
                                "children": [
                                    {
                                        "name": "join_lines_internal",
                                        "start_ns": 446706148,
                                        "end_ns": 692054538,
                                        "delta": 245348390,
                                        "depth": 3,
                                        "children": [
                                            {
                                                "name": "telemetry shape_line_pre_prune",
                                                "start_ns": 446709831,
                                                "end_ns": 500779178,
                                                "delta": 54069347,
                                                "depth": 4,
                                                "children": [],
                                                "notes": []
                                            },
                                            {
                                                "name": "remove_peninsulas",
                                                "start_ns": 511328756,
                                                "end_ns": 544765827,
                                                "delta": 33437071,
                                                "depth": 4,
                                                "children": [],
                                                "notes": []
                                            },
                                            {
                                                "name": "telemetry shape_line_pruned",
                                                "start_ns": 545082645,
                                                "end_ns": 599553184,
                                                "delta": 54470539,
                                                "depth": 4,
                                                "children": [],
                                                "notes": []
                                            },
                                            {
                                                "name": "telemetry shape_line_joined",
                                                "start_ns": 648712316,
                                                "end_ns": 691966924,
                                                "delta": 43254608,
                                                "depth": 4,
                                                "children": [],
                                                "notes": []
                                            }
                                        ],
                                        "notes": []
                                    },
                                    {
                                        "name": "connect_unconnected",
                                        "start_ns": 692059615,
                                        "end_ns": 2006152240,
                                        "delta": 1314092625,
                                        "depth": 3,
                                        "children": [
                                            {
                                                "name": "solve graph stitch",
                                                "start_ns": 696124211,
                                                "end_ns": 2006050595,
                                                "delta": 1309926384,
                                                "depth": 4,
                                                "children": [],
                                                "notes": []
                                            }
                                        ],
                                        "notes": []
                                    },
                                    {
                                        "name": "telemetry shape_line_connected",
                                        "start_ns": 2006156661,
                                        "end_ns": 2049048191,
                                        "delta": 42891530,
                                        "depth": 3,
                                        "children": [],
                                        "notes": []
                                    }
                                ],
                                "notes": []
                            }
                        ],
                        "notes": []
                    },
                    {
                        "name": "separate_polygons",
                        "start_ns": 2050513929,
                        "end_ns": 2050540118,
                        "delta": 26189,
                        "depth": 1,
                        "children": [],
                        "notes": []
                    },
                    {
                        "name": "telemetry figure_finished",
                        "start_ns": 2050628185,
                        "end_ns": 2085954693,
                        "delta": 35326508,
                        "depth": 1,
                        "children": [],
                        "notes": []
                    }
                ],
                "notes": []
            }
        ]
    },
    {
        "id": 140736286213056,
        "name": "main",
        "spans": [
            {
                "name": "scene",
                "start_ns": 3246183,
                "end_ns": 2086037490,
                "delta": 2082791307,
                "depth": 0,
                "children": [
                    {
                        "name": "evaluate GroupId(0)",
                        "start_ns": 30601590,
                        "end_ns": 363378114,
                        "delta": 332776524,
                        "depth": 1,
                        "children": [
                            {
                                "name": "eval_basic_group",
                                "start_ns": 30625855,
                                "end_ns": 363062078,
                                "delta": 332436223,
                                "depth": 2,
                                "children": [
                                    {
                                        "name": "OpenClContext::field_buffer",
                                        "start_ns": 32131522,
                                        "end_ns": 32983305,
                                        "delta": 851783,
                                        "depth": 3,
                                        "children": [],
                                        "notes": []
                                    },
                                    {
                                        "name": "OpenClContext::compile",
                                        "start_ns": 32993941,
                                        "end_ns": 345721420,
                                        "delta": 312727479,
                                        "depth": 3,
                                        "children": [],
                                        "notes": []
                                    },
                                    {
                                        "name": "eval",
                                        "start_ns": 345738257,
                                        "end_ns": 345753476,
                                        "delta": 15219,
                                        "depth": 3,
                                        "children": [],
                                        "notes": []
                                    },
                                    {
                                        "name": "telemetry intermediate_eval_basic",
                                        "start_ns": 345754587,
                                        "end_ns": 362997718,
                                        "delta": 17243131,
                                        "depth": 3,
                                        "children": [
                                            {
                                                "name": "save_field_buffer",
                                                "start_ns": 345780848,
                                                "end_ns": 352900655,
                                                "delta": 7119807,
                                                "depth": 4,
                                                "children": [
                                                    {
                                                        "name": "fetch values",
                                                        "start_ns": 345782090,
                                                        "end_ns": 346258300,
                                                        "delta": 476210,
                                                        "depth": 5,
                                                        "children": [],
                                                        "notes": []
                                                    },
                                                    {
                                                        "name": "save_image",
                                                        "start_ns": 346259521,
                                                        "end_ns": 352897141,
                                                        "delta": 6637620,
                                                        "depth": 5,
                                                        "children": [],
                                                        "notes": []
                                                    }
                                                ],
                                                "notes": []
                                            }
                                        ],
                                        "notes": []
                                    }
                                ],
                                "notes": []
                            }
                        ],
                        "notes": []
                    },
                    {
                        "name": "opencl marching [run_marching]",
                        "start_ns": 363382169,
                        "end_ns": 439723502,
                        "delta": 76341333,
                        "depth": 1,
                        "children": [
                            {
                                "name": "OpenClContext::compile",
                                "start_ns": 363393833,
                                "end_ns": 436953739,
                                "delta": 73559906,
                                "depth": 2,
                                "children": [],
                                "notes": []
                            },
                            {
                                "name": "OpenClContext::linear_buffer",
                                "start_ns": 439572304,
                                "end_ns": 439670512,
                                "delta": 98208,
                                "depth": 2,
                                "children": [],
                                "notes": []
                            },
                            {
                                "name": "OpenClContext::sync_buffer",
                                "start_ns": 439671605,
                                "end_ns": 439688504,
                                "delta": 16899,
                                "depth": 2,
                                "children": [],
                                "notes": []
                            }
                        ],
                        "notes": []
                    },
                    {
                        "name": "connect_lines",
                        "start_ns": 442502384,
                        "end_ns": 2050373046,
                        "delta": 1607870662,
                        "depth": 1,
                        "children": [
                            {
                                "name": "join_lines",
                                "start_ns": 446360689,
                                "end_ns": 2049050062,
                                "delta": 1602689373,
                                "depth": 2,
                                "children": [
                                    {
                                        "name": "join_lines_internal",
                                        "start_ns": 446706148,
                                        "end_ns": 692054538,
                                        "delta": 245348390,
                                        "depth": 3,
                                        "children": [
                                            {
                                                "name": "telemetry shape_line_pre_prune",
                                                "start_ns": 446709831,
                                                "end_ns": 500779178,
                                                "delta": 54069347,
                                                "depth": 4,
                                                "children": [],
                                                "notes": []
                                            },
                                            {
                                                "name": "remove_peninsulas",
                                                "start_ns": 511328756,
                                                "end_ns": 544765827,
                                                "delta": 33437071,
                                                "depth": 4,
                                                "children": [],
                                                "notes": []
                                            },
                                            {
                                                "name": "telemetry shape_line_pruned",
                                                "start_ns": 545082645,
                                                "end_ns": 599553184,
                                                "delta": 54470539,
                                                "depth": 4,
                                                "children": [],
                                                "notes": []
                                            },
                                            {
                                                "name": "telemetry shape_line_joined",
                                                "start_ns": 648712316,
                                                "end_ns": 691966924,
                                                "delta": 43254608,
                                                "depth": 4,
                                                "children": [],
                                                "notes": []
                                            }
                                        ],
                                        "notes": []
                                    },
                                    {
                                        "name": "connect_unconnected",
                                        "start_ns": 692059615,
                                        "end_ns": 2006152240,
                                        "delta": 1314092625,
                                        "depth": 3,
                                        "children": [
                                            {
                                                "name": "solve graph stitch",
                                                "start_ns": 696124211,
                                                "end_ns": 2006050595,
                                                "delta": 1309926384,
                                                "depth": 4,
                                                "children": [],
                                                "notes": []
                                            }
                                        ],
                                        "notes": []
                                    },
                                    {
                                        "name": "telemetry shape_line_connected",
                                        "start_ns": 2006156661,
                                        "end_ns": 2049048191,
                                        "delta": 42891530,
                                        "depth": 3,
                                        "children": [],
                                        "notes": []
                                    }
                                ],
                                "notes": []
                            }
                        ],
                        "notes": []
                    },
                    {
                        "name": "separate_polygons",
                        "start_ns": 2050513929,
                        "end_ns": 2050540118,
                        "delta": 26189,
                        "depth": 1,
                        "children": [],
                        "notes": []
                    },
                    {
                        "name": "telemetry figure_finished",
                        "start_ns": 2050628185,
                        "end_ns": 2085954693,
                        "delta": 35326508,
                        "depth": 1,
                        "children": [],
                        "notes": []
                    }
                ],
                "notes": []
            }
        ]
    }
];
